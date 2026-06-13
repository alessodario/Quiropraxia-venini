const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Dario1915%231915@db.bnmifueveerdaulgggne.supabase.co:5432/postgres"
    }
  }
});

async function main() {
  try {
    const admin = await prisma.admin.findFirst();
    console.log("Admin found:", admin);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
