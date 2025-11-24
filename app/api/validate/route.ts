import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getClaudeResponse } from '@/lib/anthropic';
import { rateLimiters, cacheKeys, cacheHelpers, cacheTTL } from '@/lib/redis';
import { z } from 'zod';

const validateSchema = z.object({
  opportunityId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const { success } = await rateLimiters.validation.limit(session.user.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can validate 10 opportunities per day.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { opportunityId } = validateSchema.parse(body);

    // Check cache first
    const cacheKey = cacheKeys.validation(opportunityId, session.user.id);
    const cachedValidation = await cacheHelpers.get<any>(cacheKey);

    if (cachedValidation) {
      return NextResponse.json({ validation: cachedValidation });
    }

    // Get opportunity
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Prepare Claude prompt
    const systemPrompt = `You are a business validation expert with deep knowledge of market analysis, competitive landscapes, and business profitability. Analyze business opportunities objectively and provide actionable insights.`;

    const userPrompt = `Analyze this business opportunity and provide a structured validation:

**Opportunity Details:**
- Title: ${opportunity.title}
- Description: ${opportunity.description}
- Niche: ${opportunity.niche}
- Estimated Revenue: $${opportunity.estimatedRevenueMin} - $${opportunity.estimatedRevenueMax}/month
- Startup Cost: $${opportunity.startupCost}
- Time to Launch: ${opportunity.timeToLaunchHours} hours
- Difficulty: ${opportunity.difficulty}
- Market Size: ${opportunity.marketSize}
- Competition Level: ${opportunity.competitionLevel}
- Target Audience: ${opportunity.targetAudience}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "marketDemand": <number 0-100>,
  "competitorGaps": <number 0-100>,
  "profitability": <number 0-100>,
  "riskScore": <number 0-100>,
  "revenueMonth1Min": <number>,
  "revenueMonth1Max": <number>,
  "revenueMonth3Min": <number>,
  "revenueMonth3Max": <number>,
  "revenueMonth6Min": <number>,
  "revenueMonth6Max": <number>,
  "risks": [
    {
      "risk": "Description of risk",
      "severity": "low|medium|high",
      "mitigation": "How to mitigate this risk"
    }
  ],
  "actionPlan": [
    {
      "step": "Action step description",
      "priority": "high|medium|low",
      "estimatedTime": "Time estimate"
    }
  ]
}`;

    // Get Claude response
    const response = await getClaudeResponse(systemPrompt, userPrompt);

    // Parse JSON response
    let validationData;
    try {
      // Extract JSON from response (in case Claude adds any text around it)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      validationData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', response);
      throw new Error('Failed to parse validation response');
    }

    // Save validation to database
    const validation = await prisma.validation.create({
      data: {
        userId: session.user.id,
        opportunityId,
        marketDemand: validationData.marketDemand,
        competitorGaps: validationData.competitorGaps,
        profitability: validationData.profitability,
        riskScore: validationData.riskScore,
        revenueMonth1Min: validationData.revenueMonth1Min,
        revenueMonth1Max: validationData.revenueMonth1Max,
        revenueMonth3Min: validationData.revenueMonth3Min,
        revenueMonth3Max: validationData.revenueMonth3Max,
        revenueMonth6Min: validationData.revenueMonth6Min,
        revenueMonth6Max: validationData.revenueMonth6Max,
        risks: validationData.risks,
        actionPlan: validationData.actionPlan,
      },
    });

    // Cache the validation
    await cacheHelpers.set(cacheKey, validation, cacheTTL.validation);

    return NextResponse.json({ validation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
