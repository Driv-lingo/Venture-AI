import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { wizardData, businessInfo } = await req.json();
    const { businessId } = await params;

    console.log('=== Website Generation Request ===');
    console.log('Business ID:', businessId);
    console.log('Wizard Data:', JSON.stringify(wizardData, null, 2));
    console.log('Business Info:', businessInfo);

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.userId !== session.user.id) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Generate website content using Claude
    const prompt = `You are a professional web designer and copywriter. Generate a complete website structure and content for this business:

Business: ${businessInfo.title}
Niche: ${businessInfo.niche}

Wizard Data:
- Domain: ${wizardData.domainName || 'Not specified'}
- Brand Name: ${wizardData.brandName || businessInfo.title}
- Tagline: ${wizardData.tagline || ''}
- MVP Features: ${wizardData.mvpFeatures || ''}
- Target Audience: ${wizardData.targetAudience || ''}
- Value Proposition: ${wizardData.valueProposition || ''}
- Marketing Strategy: ${wizardData.marketingStrategy || ''}
- Revenue Model: ${wizardData.revenueModel || ''}

Generate a professional website with:
1. Home page with hero section, features, benefits, CTA
2. About page
3. Services/Products page
4. Contact page
5. Color scheme (primary, secondary, accent colors)
6. Typography recommendations

Return ONLY valid JSON in this exact format:
{
  "name": "string",
  "domain": "string",
  "theme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "fontFamily": "string"
  },
  "pages": [
    {
      "title": "Home",
      "slug": "home",
      "content": {
        "hero": {
          "headline": "string",
          "subheadline": "string",
          "cta": "string"
        },
        "features": [
          {
            "title": "string",
            "description": "string"
          }
        ],
        "benefits": "string",
        "cta": {
          "text": "string",
          "action": "string"
        }
      }
    },
    {
      "title": "About",
      "slug": "about",
      "content": {
        "story": "string",
        "mission": "string",
        "values": ["string"]
      }
    },
    {
      "title": "Services",
      "slug": "services",
      "content": {
        "services": [
          {
            "name": "string",
            "description": "string",
            "price": "string"
          }
        ]
      }
    },
    {
      "title": "Contact",
      "slug": "contact",
      "content": {
        "email": "contact@example.com",
        "phone": "+1234567890",
        "address": "string"
      }
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
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
    let websiteData;
    try {
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      websiteData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse AI response');
    }

    // Create or update website in database
    const subdomain = (websiteData.domain || wizardData.domainName || businessInfo.title)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const website = await prisma.website.upsert({
      where: { businessId },
      update: {
        customDomain: websiteData.domain || wizardData.domainName,
        theme: websiteData.theme,
        seo: {
          title: websiteData.name,
          description: wizardData.tagline || businessInfo.title,
        },
      },
      create: {
        businessId,
        subdomain: subdomain,
        customDomain: websiteData.domain || wizardData.domainName,
        theme: websiteData.theme,
        seo: {
          title: websiteData.name,
          description: wizardData.tagline || businessInfo.title,
        },
      },
    });

    // Create pages
    await prisma.page.deleteMany({
      where: { websiteId: website.id },
    });

    for (const pageData of websiteData.pages) {
      await prisma.page.create({
        data: {
          websiteId: website.id,
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content,
          isPublished: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      website,
      message: 'Website generated successfully',
    });
  } catch (error) {
    console.error('Generate website error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate website',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
