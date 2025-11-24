import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redis, cacheKeys, cacheTTL, cacheHelpers } from '@/lib/redis';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  capital: z.enum(['under1k', '1k-5k', '5k-plus']).optional(),
  timeCommitment: z.enum(['sideHustle', 'partTime', 'fullTime']).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  onboardingComplete: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get from cache first
    const cacheKey = cacheKeys.userProfile(session.user.id);
    const cachedProfile = await cacheHelpers.get(cacheKey);

    if (cachedProfile) {
      return NextResponse.json({ user: cachedProfile });
    }

    // Get from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        skills: true,
        interests: true,
        capital: true,
        timeCommitment: true,
        experienceLevel: true,
        onboardingComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cache the profile
    await cacheHelpers.set(cacheKey, user, cacheTTL.userProfile);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = updateProfileSchema.parse(body);

    // Update user
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        skills: true,
        interests: true,
        capital: true,
        timeCommitment: true,
        experienceLevel: true,
        onboardingComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Invalidate cache
    const cacheKey = cacheKeys.userProfile(session.user.id);
    await cacheHelpers.del(cacheKey);

    // Also invalidate opportunities cache since matching criteria changed
    if (data.skills || data.interests || data.capital || data.timeCommitment) {
      const oppCacheKey = cacheKeys.userOpportunities(session.user.id);
      await cacheHelpers.del(oppCacheKey);
    }

    return NextResponse.json({ user, message: 'Profile updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
