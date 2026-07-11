import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: 'Food', color: '#F97316', icon: 'Coffee' },
    { name: 'Shopping', color: '#8B5CF6', icon: 'ShoppingBag' },
    { name: 'Travel', color: '#06B6D4', icon: 'Plane' },
    { name: 'Bills', color: '#EF4444', icon: 'Receipt' },
    { name: 'Entertainment', color: '#EC4899', icon: 'Film' },
    { name: 'Other', color: '#6B7280', icon: 'MoreHorizontal' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seed completed: Added categories.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
