import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, User, Shield, Key, Database, LogOut, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Query database statistics
  const totalTransactions = await prisma.expense.count({
    where: { userId },
  });

  const totalIncomeSum = await prisma.expense.aggregate({
    where: { userId, type: 'INCOME' },
    _sum: { amount: true },
  });

  const totalExpensesSum = await prisma.expense.aggregate({
    where: { userId, type: 'EXPENSE' },
    _sum: { amount: true },
  });

  const incomeAmount = totalIncomeSum._sum.amount || 0;
  const expenseAmount = totalExpensesSum._sum.amount || 0;
  const balance = incomeAmount - expenseAmount;

  const geminiConfigured = !!process.env.GEMINI_API_KEY;

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-24 bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/" className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center">Settings</h1>
        <div className="bg-muted/50 rounded-full">
          <ThemeToggle />
        </div>
      </div>

      <div className="space-y-6">
        {/* User Card */}
        <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-md">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {user?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Verified Member
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview Stats Card */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Expenify Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-muted/40 rounded-2xl">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Transactions</p>
                <p className="text-lg font-bold text-foreground">{totalTransactions}</p>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase mb-1">Total Income</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹{incomeAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold uppercase mb-1">Expenses</p>
                <p className="text-base font-bold text-rose-600 dark:text-rose-400">₹{expenseAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System & API Configurations */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Currency Option */}
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">Base Currency</p>
                <p className="text-xs text-muted-foreground">Default currency for tracking</p>
              </div>
              <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                INR (₹)
              </div>
            </div>

            {/* AI Insights Model */}
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">AI Analytics Engine</p>
                <p className="text-xs text-muted-foreground">Model utilized for financial summaries</p>
              </div>
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 2.5 Flash
              </div>
            </div>

            {/* API Key Connection */}
            <div className="flex justify-between items-center py-2">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">Gemini API Connection</p>
                <p className="text-xs text-muted-foreground">Status of Google AI service key</p>
              </div>
              {geminiConfigured ? (
                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </div>
              ) : (
                <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Key Missing
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <SignOutButton redirectUrl="/sign-in">
            <button className="flex items-center justify-center gap-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all text-sm cursor-pointer">
              <LogOut className="w-4 h-4" />
              Sign Out of App
            </button>
          </SignOutButton>
          <p className="text-[10px] text-center text-muted-foreground font-semibold uppercase">
            Expenify Tracker v1.2.0
          </p>
        </div>
      </div>
    </div>
  );
}
