import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cacheKeys, cacheHelpers, cacheTTL } from '@/lib/redis';
import { calculateMatch } from '@/lib/matching';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const niche = searchParams.get('niche');
    const difficulty = searchParams.get('difficulty');
    const maxCost = searchParams.get('maxCost');
    const sortBy = searchParams.get('sortBy') || 'matchScore';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Try cache first
    const cacheKey = cacheKeys.userOpportunities(session.user.id);
    const cachedData = await cacheHelpers.get<any>(cacheKey);

    if (cachedData && !niche && !difficulty && !maxCost) {
      return NextResponse.json({ opportunities: cachedData.slice(0, limit) });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build filter conditions
    const where: any = {};
    if (niche) where.niche = niche;
    if (difficulty) where.difficulty = difficulty;
    if (maxCost) where.startupCost = { lte: parseInt(maxCost) };

    // Get opportunities
    const opportunities = await prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100, // Get more to calculate matches
    });

    // Calculate match scores
    const opportunitiesWithMatches = opportunities.map((opp) => {
      const match = calculateMatch(user, opp);
      return {
        ...opp,
        matchScore: match.matchScore,
        matchExplanation: match.explanation,
      };
    });

    // Sort based on sortBy parameter
    opportunitiesWithMatches.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.estimatedRevenueMax - a.estimatedRevenueMax;
        case 'cost':
          return a.startupCost - b.startupCost;
        case 'time':
          return a.timeToLaunchHours - b.timeToLaunchHours;
        case 'matchScore':
        default:
          return b.matchScore - a.matchScore;
      }
    });

    const topOpportunities = opportunitiesWithMatches.slice(0, limit);

    // Cache the results if no filters applied
    if (!niche && !difficulty && !maxCost) {
      await cacheHelpers.set(
        cacheKey,
        opportunitiesWithMatches,
        cacheTTL.opportunities
      );
    }

    return NextResponse.json({ opportunities: topOpportunities });
  } catch (error) {
    console.error('Get opportunities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
