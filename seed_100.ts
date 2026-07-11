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
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error('No users found in the database. Please sign in to the app first to create a user profile.');
  }

  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    throw new Error('No categories found. Run prisma/seed.ts first.');
  }

  const expenses = [];
  const now = new Date();

  // Create some realistic income
  for (let i = 0; i < 5; i++) {
    const incomeDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    expenses.push({
      amount: Math.floor(Math.random() * 50000) + 20000,
      description: i % 2 === 0 ? 'Monthly Salary' : 'Freelance Project',
      date: incomeDate,
      type: 'INCOME' as const,
      userId: user.clerkId,
      // Income can optionally have a category, or be null
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
    });
  }

  // Create 95 realistic expenses
  const expenseDescriptions = {
    Food: ['Coffee Shop', 'Lunch with client', 'Groceries', 'Dinner delivery', 'Snacks'],
    Shopping: ['Amazon Purchase', 'Clothing store', 'Electronics', 'Books', 'Home Decor'],
    Travel: ['Uber ride', 'Gas Station', 'Train ticket', 'Flight booking', 'Parking fee'],
    Bills: ['Electricity Bill', 'Internet Bill', 'Water Bill', 'Phone plan', 'Subscription'],
    Entertainment: ['Movie tickets', 'Concert', 'Gaming', 'Streaming service', 'Museum entry'],
    Other: ['Pharmacy', 'Gift', 'Charity donation', 'Gym membership', 'Haircut']
  };

  for (let i = 0; i < 95; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const descList = expenseDescriptions[category.name as keyof typeof expenseDescriptions] || ['Misc expense'];
    const description = descList[Math.floor(Math.random() * descList.length)];
    
    // Bias dates to the last 60 days
    const expenseDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    
    // Random amount biased by category (e.g., Bills > Food)
    let amount = 0;
    if (category.name === 'Bills' || category.name === 'Travel') {
      amount = Math.floor(Math.random() * 4000) + 500;
    } else if (category.name === 'Food') {
      amount = Math.floor(Math.random() * 800) + 100;
    } else {
      amount = Math.floor(Math.random() * 2000) + 200;
    }

    expenses.push({
      amount,
      description,
      date: expenseDate,
      type: 'EXPENSE' as const,
      userId: user.clerkId,
      categoryId: category.id,
    });
  }

  // Insert records
  await prisma.expense.createMany({
    data: expenses,
  });

  console.log(`Successfully inserted ${expenses.length} realistic records for user ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
