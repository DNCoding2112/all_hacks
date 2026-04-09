const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const tables = await prisma.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='table';");
    console.log('Tables found:', tables);
    const count = await prisma.hackathon.count();
    console.log('Total Hackathons in DB:', count);
  } catch (e) {
    console.error('Error checking tables:', e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
