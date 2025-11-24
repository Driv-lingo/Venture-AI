import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['planning', 'building', 'live', 'paused', 'closed']).optional(),
  launchProgress: z.number().min(0).max(100).optional(),
  wizardData: z.any().optional(), // Store wizard data as JSON
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const business = await prisma.business.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        metrics: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Get business error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const body = await req.json();
    const updates = updateSchema.parse(body);

    // Verify ownership
    const existing = await prisma.business.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Update business
    const business = await prisma.business.update({
      where: { id: params.id },
      data: updates,
    });

    // Invalidate cache
    await redis.del(`business:${params.id}:metrics:${new Date().toISOString().split('T')[0]}`);

    return NextResponse.json({ business });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update business error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    // Verify ownership
    const existing = await prisma.business.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Soft delete by setting status to closed
    await prisma.business.update({
      where: { id: params.id },
      data: { status: 'closed' },
    });

    return NextResponse.json({ message: 'Business closed successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
