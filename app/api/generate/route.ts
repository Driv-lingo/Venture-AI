import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { anthropic } from '@/lib/anthropic';
import { rateLimiters } from '@/lib/redis';
import { z } from 'zod';

const generateSchema = z.object({
  prompt: z.string(),
  context: z.object({
    niche: z.string().optional(),
    opportunityTitle: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const { success } = await rateLimiters.api.limit(session.user.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt, context } = generateSchema.parse(body);

    // Build context-aware prompt
    let fullPrompt = prompt;
    if (context) {
      fullPrompt = `Context: ${context.niche ? `Niche: ${context.niche}. ` : ''}${context.opportunityTitle ? `Business: ${context.opportunityTitle}. ` : ''}\n\n${prompt}\n\nProvide a concise, actionable response.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ content });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
