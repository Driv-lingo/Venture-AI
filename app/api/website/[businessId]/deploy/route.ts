import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Deploy website
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
      include: { pages: true },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Update build status to building
    await prisma.website.update({
      where: { id: website.id },
      data: { buildStatus: 'building' },
    });

    // TODO: Implement actual deployment logic
    // For now, simulate deployment
    const deploymentUrl = website.customDomain || `https://${website.subdomain}.ventureai.app`;

    // Update website with deployment info
    const updatedWebsite = await prisma.website.update({
      where: { id: website.id },
      data: {
        buildStatus: 'live',
        deploymentUrl,
        lastDeployed: new Date(),
      },
    });

    return NextResponse.json({ 
      website: updatedWebsite,
      message: 'Website deployed successfully' 
    });
  } catch (error) {
    console.error('Deploy website error:', error);
    
    // Update build status to failed
    const params = await context.params;
    try {
      await prisma.website.update({
        where: { businessId: params.businessId },
        data: { buildStatus: 'failed' },
      });
    } catch (e) {
      console.error('Failed to update build status:', e);
    }

    return NextResponse.json(
      { error: 'Deployment failed' },
      { status: 500 }
    );
  }
}
