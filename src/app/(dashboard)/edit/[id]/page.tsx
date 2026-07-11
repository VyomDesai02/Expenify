import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { EditClient } from './EditClient';

export default async function EditPage(props: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const params = await props.params;

  const transaction = await prisma.expense.findUnique({
    where: { 
      id: params.id,
      userId: userId 
    },
    include: {
      category: true
    }
  });

  if (!transaction) {
    redirect('/');
  }

  const categories = await prisma.category.findMany();

  return <EditClient transaction={transaction} categories={categories} />;
}
