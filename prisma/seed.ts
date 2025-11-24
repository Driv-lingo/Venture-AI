import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample opportunities
  const opportunities = [
    {
      title: 'AI-Powered Resume Builder SaaS',
      description: 'Build a SaaS platform that uses AI to help job seekers create professional resumes optimized for ATS systems. Growing demand with 500K+ monthly searches.',
      niche: 'Career Tech',
      estimatedRevenueMin: 5000,
      estimatedRevenueMax: 25000,
      startupCost: 2000,
      timeToLaunchHours: 120,
      difficulty: 'medium',
      marketSize: 'Large ($2B+ market)',
      competitionLevel: 'medium',
      targetAudience: 'Job seekers, career changers, recent graduates',
      keySuccessFactors: ['SEO optimization', 'AI integration', 'User-friendly interface', 'ATS compatibility'],
      reasoning: 'Strong market demand with consistent search volume. AI differentiation provides competitive advantage. Subscription model ensures recurring revenue.',
      nextSteps: [
        'Research top ATS systems and their requirements',
        'Build MVP with basic resume templates',
        'Integrate AI for content suggestions',
        'Launch beta with 100 users',
        'Implement payment processing',
        'Scale marketing efforts'
      ],
      sourceData: {
        googleTrends: { searchVolume: 550000, trend: 'rising' },
        reddit: { mentions: 1200, sentiment: 'positive' }
      }
    },
    {
      title: 'Notion Templates Marketplace',
      description: 'Create and sell premium Notion templates for productivity, project management, and personal organization. Low barrier to entry with high margins.',
      niche: 'Productivity Tools',
      estimatedRevenueMin: 2000,
      estimatedRevenueMax: 15000,
      startupCost: 500,
      timeToLaunchHours: 60,
      difficulty: 'easy',
      marketSize: 'Medium ($500M market)',
      competitionLevel: 'low',
      targetAudience: 'Notion users, entrepreneurs, students, remote workers',
      keySuccessFactors: ['Quality templates', 'Social media marketing', 'SEO', 'Community building'],
      reasoning: 'Notion has 30M+ users and growing. Template marketplace is underserved. Low startup costs and quick to market.',
      nextSteps: [
        'Create 10 high-quality template designs',
        'Set up Gumroad or similar platform',
        'Build landing page with previews',
        'Launch on Product Hunt',
        'Grow Twitter/LinkedIn presence',
        'Partner with Notion influencers'
      ],
      sourceData: {
        productHunt: { upvotes: 850, comments: 120 },
        indieHackers: { revenue: 8000, mrr: true }
      }
    },
    {
      title: 'Local Service Booking Platform',
      description: 'Connect local service providers (cleaners, handymen, tutors) with customers. Focus on underserved suburban markets.',
      niche: 'Local Services',
      estimatedRevenueMin: 8000,
      estimatedRevenueMax: 40000,
      startupCost: 5000,
      timeToLaunchHours: 200,
      difficulty: 'hard',
      marketSize: 'Very Large ($10B+ market)',
      competitionLevel: 'high',
      targetAudience: 'Homeowners, busy professionals, service providers',
      keySuccessFactors: ['Local SEO', 'Provider vetting', 'Trust building', 'Mobile app'],
      reasoning: 'Massive market with room for regional players. High customer lifetime value. Network effects create moat.',
      nextSteps: [
        'Choose target city/region',
        'Recruit 20 service providers',
        'Build MVP booking platform',
        'Launch with limited services',
        'Focus on customer acquisition',
        'Expand service categories'
      ],
      sourceData: {
        googleTrends: { searchVolume: 820000, trend: 'stable' },
        reddit: { mentions: 2400, sentiment: 'mixed' }
      }
    },
    {
      title: 'Newsletter Sponsorship Marketplace',
      description: 'Platform connecting newsletter creators with brands for sponsorship deals. Automate the sponsorship process with AI matching.',
      niche: 'Creator Economy',
      estimatedRevenueMin: 3000,
      estimatedRevenueMax: 20000,
      startupCost: 1500,
      timeToLaunchHours: 100,
      difficulty: 'medium',
      marketSize: 'Medium ($800M market)',
      competitionLevel: 'low',
      targetAudience: 'Newsletter creators, brands, marketing agencies',
      keySuccessFactors: ['Two-sided marketplace', 'Quality matching', 'Payment processing', 'Analytics'],
      reasoning: 'Newsletter market growing 30% YoY. Sponsorship process is manual and inefficient. Take 15-20% commission.',
      nextSteps: [
        'Build marketplace MVP',
        'Onboard 50 newsletter creators',
        'Reach out to 100 brands',
        'Facilitate first 10 deals',
        'Automate matching algorithm',
        'Scale both sides'
      ],
      sourceData: {
        indieHackers: { revenue: 12000, mrr: true },
        productHunt: { upvotes: 640, comments: 85 }
      }
    },
    {
      title: 'AI Social Media Content Generator',
      description: 'Tool that generates engaging social media posts, captions, and hashtags using AI. Target small businesses and solopreneurs.',
      niche: 'Marketing Tech',
      estimatedRevenueMin: 4000,
      estimatedRevenueMax: 18000,
      startupCost: 1000,
      timeToLaunchHours: 80,
      difficulty: 'easy',
      marketSize: 'Large ($3B+ market)',
      competitionLevel: 'medium',
      targetAudience: 'Small businesses, solopreneurs, social media managers',
      keySuccessFactors: ['AI quality', 'Platform integrations', 'Content calendar', 'Affordable pricing'],
      reasoning: 'Every business needs social media content. AI makes it scalable. Subscription model with high retention.',
      nextSteps: [
        'Integrate Claude/GPT API',
        'Build content generation UI',
        'Add scheduling features',
        'Launch free tier',
        'Content marketing strategy',
        'Partner with agencies'
      ],
      sourceData: {
        googleTrends: { searchVolume: 450000, trend: 'rising' },
        reddit: { mentions: 980, sentiment: 'positive' }
      }
    }
  ];

  for (const opp of opportunities) {
    await prisma.opportunity.create({
      data: opp
    });
  }

  console.log(`Created ${opportunities.length} opportunities`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
