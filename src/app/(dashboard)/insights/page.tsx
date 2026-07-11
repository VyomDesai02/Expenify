import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { generateAiInsights } from '@/lib/gemini';

export default async function InsightsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch recent transactions to analyze
  const transactions = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 30, // Last 30 transactions
    include: { category: true },
  });

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const cat = t.category?.name || 'Other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Format data for Gemini prompt
  const analysisData = {
    totalIncome,
    totalExpenses,
    expensesByCategory,
    recentTransactions: transactions.slice(0, 5).map(t => ({
      amount: t.amount,
      type: t.type,
      category: t.category?.name || 'Other',
      description: t.description
    }))
  };

  let insightsMarkdown = "";
  try {
    if (transactions.length > 0) {
      insightsMarkdown = await generateAiInsights(analysisData);
    } else {
      insightsMarkdown = "You don't have any transactions yet. Add some expenses and income to get AI-powered insights on your spending habits!";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    insightsMarkdown = "Sorry, we couldn't generate insights at this moment. Please ensure your Gemini API key is configured correctly.";
  }

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-24 bg-background">
      <div className="flex items-center mb-8">
        <Link href="/" className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center">AI Insights</h1>
        <div className="bg-muted/50 rounded-full">
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-[#111827] text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Smart Analysis</h2>
          <p className="text-white/70 text-sm">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="bg-card dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-border/50 prose prose-sm max-w-none text-foreground">
        {/* We will render simple markdown manually or dangerouslySetInnerHTML. For safety, we should parse it, but for demo we just display paragraphs */}
        {insightsMarkdown.split('\n').map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          
          if (paragraph.startsWith('##')) {
            return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.replace(/#/g, '').trim()}</h3>;
          }
          if (paragraph.startsWith('-') || paragraph.startsWith('*')) {
            return <li key={index} className="ml-4 mb-1 text-muted-foreground">{paragraph.substring(1).trim()}</li>;
          }
          if (paragraph.includes('**')) {
            // Very rudimentary bold parsing
            const parts = paragraph.split('**');
            return (
              <p key={index} className="mb-3 text-muted-foreground leading-relaxed">
                {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part)}
              </p>
            );
          }
          return <p key={index} className="mb-3 text-muted-foreground leading-relaxed">{paragraph}</p>;
        })}
      </div>
    </div>
  );
}
