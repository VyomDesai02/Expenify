'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTransaction(data: {
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  categoryName?: string;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  let categoryId = null;

  if (data.type === 'EXPENSE' && data.categoryName) {
    const category = await prisma.category.findUnique({
      where: { name: data.categoryName }
    });
    
    if (category) {
      categoryId = category.id;
    }
  }

  await prisma.expense.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      date: new Date(),
      userId: userId,
      categoryId: categoryId,
    }
  });

  revalidatePath('/');
  revalidatePath('/report');
}

export async function deleteTransaction(id: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  await prisma.expense.delete({
    where: {
      id: id,
      userId: userId, // Security check
    }
  });

  revalidatePath('/');
  revalidatePath('/report');
}

export async function updateTransaction(
  id: string,
  data: {
    amount: number;
    description: string;
    type: 'INCOME' | 'EXPENSE';
    categoryName?: string;
  }
) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  let categoryId = null;

  if (data.type === 'EXPENSE' && data.categoryName) {
    const category = await prisma.category.findUnique({
      where: { name: data.categoryName }
    });
    
    if (category) {
      categoryId = category.id;
    }
  }

  await prisma.expense.update({
    where: {
      id: id,
      userId: userId,
    },
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      categoryId: categoryId,
    }
  });

  revalidatePath('/');
  revalidatePath('/report');
}
