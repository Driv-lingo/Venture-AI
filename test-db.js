const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Try to count users
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users`);
    
    // Try to count businesses
    const businessCount = await prisma.business.count();
    console.log(`✅ Found ${businessCount} businesses`);
    
    console.log('\n✅ Database is working!');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
