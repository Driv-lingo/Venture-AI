import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch website for a business
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    
    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: params.businessId,
        userId: session.user.id,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Get website
    const website = await prisma.website.findUnique({
      where: { businessId: params.businessId },
      include: {
        pages: true,
        analytics: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    return NextResponse.json({ website });
  } catch (error) {
    console.error('Get website error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create website for a business
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const body = await req.json();
    
    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: params.businessId,
        userId: session.user.id,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Check if website already exists
    const existing = await prisma.website.findUnique({
      where: { businessId: params.businessId },
    });

    if (existing) {
      return NextResponse.json({ error: 'Website already exists' }, { status: 400 });
    }

    // Create website
    const website = await prisma.website.create({
      data: {
        businessId: params.businessId,
        subdomain: body.subdomain || business.domainName?.replace(/\./g, '-') || `business-${params.businessId.slice(0, 8)}`,
        customDomain: body.customDomain || null,
        theme: body.theme || {
          primaryColor: '#C84B31',
          secondaryColor: '#2D4059',
          fontFamily: 'Inter',
          logo: '',
        },
        seo: body.seo || {
          title: business.opportunityTitle,
          description: business.niche,
          keywords: business.niche,
        },
      },
    });

    // Create default home page
    await prisma.page.create({
      data: {
        websiteId: website.id,
        slug: '/',
        title: 'Home',
        content: {
          sections: [
            {
              type: 'hero',
              title: business.opportunityTitle,
              subtitle: business.niche,
              cta: 'Get Started',
            },
          ],
        },
        isPublished: false,
      },
    });

    return NextResponse.json({ website });
  } catch (error) {
    console.error('Create website error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update website
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const body = await req.json();
    
    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: params.businessId,
        userId: session.user.id,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Update website
    const website = await prisma.website.update({
      where: { businessId: params.businessId },
      data: {
        subdomain: body.subdomain,
        customDomain: body.customDomain || null,
        theme: body.theme,
        seo: body.seo,
      },
    });

    return NextResponse.json({ website });
  } catch (error) {
    console.error('Update website error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
