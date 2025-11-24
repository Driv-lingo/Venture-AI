// Quick script to add test wizard data to your existing business
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addWizardData() {
  try {
    // Get the first business
    const business = await prisma.business.findFirst({
      where: { status: 'live' }
    });

    if (!business) {
      console.log('No business found');
      return;
    }

    console.log('Found business:', business.opportunityTitle);

    // Add sample wizard data
    const wizardData = {
      domainName: 'taskautomation.com',
      brandName: business.opportunityTitle,
      tagline: 'Automate Your Business Tasks Effortlessly',
      mvpFeatures: 'Task scheduling, automation workflows, integrations with popular tools, analytics dashboard',
      targetAudience: 'Small business owners and entrepreneurs who want to save time on repetitive tasks',
      valueProposition: 'Save 10+ hours per week by automating your routine business tasks',
      marketingStrategy: 'Content marketing, SEO, social media advertising, partnerships with business tools',
      revenueModel: 'Subscription-based: $29/month starter, $79/month professional, $199/month enterprise'
    };

    await prisma.business.update({
      where: { id: business.id },
      data: { wizardData }
    });

    console.log('✅ Wizard data added successfully!');
    console.log('Now refresh your browser and try the "Regenerate from Wizard" button');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addWizardData();
