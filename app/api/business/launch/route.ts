import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimiters } from '@/lib/redis';
import { z } from 'zod';

const launchSchema = z.object({
  opportunityTitle: z.string(),
  niche: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting - temporarily disabled for debugging
    // const { success } = await rateLimiters.launch.limit(session.user.id);
    // if (!success) {
    //   return NextResponse.json(
    //     { error: 'Rate limit exceeded. You can launch 5 businesses per week.' },
    //     { status: 429 }
    //   );
    // }

    const body = await req.json();
    const { opportunityTitle, niche } = launchSchema.parse(body);

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found. Please sign in again.' },
        { status: 401 }
      );
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        userId: session.user.id,
        opportunityTitle,
        niche,
        status: 'planning',
        launchProgress: 0,
      },
    });

    return NextResponse.json(
      { business, message: 'Business launch initiated' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Launch business error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
