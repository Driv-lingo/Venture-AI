import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId } = await params;

    // Get website
    const website = await prisma.website.findUnique({
      where: { businessId },
      include: {
        pages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!website) {
      return NextResponse.json({ pages: [] });
    }

    return NextResponse.json({ pages: website.pages });
  } catch (error) {
    console.error('Get pages error:', error);
    return NextResponse.json(
      { error: 'Failed to get pages' },
      { status: 500 }
    );
  }
}
