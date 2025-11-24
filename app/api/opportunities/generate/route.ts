import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has completed onboarding
    if (!user.onboardingComplete) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      );
    }

    // Generate opportunities using Claude
    const prompt = `You are a business opportunity analyst. Generate 10 personalized business opportunities for an entrepreneur with the following profile:

Skills: ${user.skills.join(', ')}
Interests: ${user.interests.join(', ')}
Available Capital: ${user.capital}
Time Commitment: ${user.timeCommitment}
Experience Level: ${user.experienceLevel}

For each opportunity, provide:
1. Title (concise, compelling)
2. Description (2-3 sentences)
3. Niche (specific market segment)
4. Estimated Revenue Range (monthly, min and max in USD)
5. Startup Cost (in USD)
6. Time to Launch (in hours)
7. Difficulty (beginner, intermediate, advanced)
8. Market Size (small, medium, large)
9. Competition Level (low, medium, high)
10. Target Audience (specific demographic)
11. Key Success Factors (3-5 bullet points)
12. Match Score (0-100, how well this matches the user's profile)
13. Match Explanation (why this is a good fit)

Focus on:
- Opportunities that leverage their skills
- Markets aligned with their interests
- Realistic for their capital and time commitment
- Appropriate for their experience level
- Currently trending or evergreen niches
- Actionable and specific ideas

Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "string",
    "description": "string",
    "niche": "string",
    "estimatedRevenueMin": number,
    "estimatedRevenueMax": number,
    "startupCost": number,
    "timeToLaunchHours": number,
    "difficulty": "beginner|intermediate|advanced",
    "marketSize": "small|medium|large",
    "competitionLevel": "low|medium|high",
    "targetAudience": "string",
    "keySuccessFactors": ["string"],
    "matchScore": number,
    "matchExplanation": "string"
  }
]`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    let opportunities;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      opportunities = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse AI response');
    }

    // Save opportunities to database
    const savedOpportunities = await Promise.all(
      opportunities.map(async (opp: any) => {
        const opportunity = await prisma.opportunity.create({
          data: {
            title: opp.title,
            description: opp.description,
            niche: opp.niche,
            estimatedRevenueMin: opp.estimatedRevenueMin,
            estimatedRevenueMax: opp.estimatedRevenueMax,
            startupCost: opp.startupCost,
            timeToLaunchHours: opp.timeToLaunchHours,
            difficulty: opp.difficulty,
            marketSize: opp.marketSize,
            competitionLevel: opp.competitionLevel,
            targetAudience: opp.targetAudience,
            keySuccessFactors: opp.keySuccessFactors,
            reasoning: opp.matchExplanation,
            nextSteps: [],
            sourceData: { generatedFor: user.id, timestamp: new Date() },
          },
        });

        // Create opportunity match
        await prisma.opportunityMatch.create({
          data: {
            userId: user.id,
            opportunityId: opportunity.id,
            matchScore: opp.matchScore,
            skillsMatch: Math.min(100, opp.matchScore + 5),
            interestsMatch: Math.min(100, opp.matchScore + 3),
            capitalMatch: Math.min(100, opp.matchScore - 2),
            timeMatch: Math.min(100, opp.matchScore),
            explanation: opp.matchExplanation,
          },
        });

        return opportunity;
      })
    );

    return NextResponse.json({
      opportunities: savedOpportunities,
      message: `Generated ${savedOpportunities.length} personalized opportunities`,
    });
  } catch (error) {
    console.error('Generate opportunities error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      {
        error: 'Failed to generate opportunities',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
