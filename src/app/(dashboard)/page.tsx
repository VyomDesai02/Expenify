import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { UserButton } from '@clerk/nextjs';
import { Bell, ArrowUpRight, ArrowDownRight, Wallet, Coffee, ShoppingBag, Plane, Receipt, Film, MoreHorizontal, BarChart2 } from 'lucide-react';
import { NotificationBell, DateSelector } from '@/components/DashboardActions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TransactionActions } from '@/components/TransactionActions';

// Map icons to categories
const iconMap: Record<string, React.ReactNode> = {
  Food: <Coffee className="h-5 w-5" />,
  Shopping: <ShoppingBag className="h-5 w-5" />,
  Travel: <Plane className="h-5 w-5" />,
  Bills: <Receipt className="h-5 w-5" />,
  Entertainment: <Film className="h-5 w-5" />,
  Other: <MoreHorizontal className="h-5 w-5" />,
};

export default async function DashboardPage(props: { searchParams?: Promise<{ month?: string }> }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  // Ensure user exists in DB
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: user?.emailAddresses[0]?.emailAddress || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      imageUrl: user?.imageUrl || '',
    },
    create: {
      clerkId: userId,
      email: user?.emailAddresses[0]?.emailAddress || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      imageUrl: user?.imageUrl || '',
    },
  });

  const searchParams = props.searchParams ? await props.searchParams : {};
  let targetMonth = searchParams.month;

  const now = new Date();
  let startOfMonth: Date;
  let endOfMonth: Date;

  if (targetMonth) {
    const [year, month] = targetMonth.split('-');
    startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
    endOfMonth = new Date(parseInt(year), parseInt(month), 1);
  } else {
    startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  // Dynamic Date Display
  const currentFormattedDate = startOfMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Calculate dynamic weekly comparison (this 7 days vs previous 7 days)
  const oneDay = 24 * 60 * 60 * 1000;
  const startOfThisWeek = new Date(now.getTime() - 7 * oneDay);
  const startOfLastWeek = new Date(now.getTime() - 14 * oneDay);

  const thisWeekExpensesSum = await prisma.expense.aggregate({
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: startOfThisWeek },
    },
    _sum: { amount: true },
  });

  const lastWeekExpensesSum = await prisma.expense.aggregate({
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: startOfLastWeek, lt: startOfThisWeek },
    },
    _sum: { amount: true },
  });

  const thisWeekSpent = thisWeekExpensesSum._sum.amount || 0;
  const lastWeekSpent = lastWeekExpensesSum._sum.amount || 0;
  const weeklyDiff = thisWeekSpent - lastWeekSpent;

  const transactions = await prisma.expense.findMany({
    where: { 
      userId: userId,
      date: { gte: startOfMonth, lt: endOfMonth }
    },
    orderBy: { date: 'desc' },
    take: 5,
    include: { category: true },
  });

  const monthlyExpenses = await prisma.expense.aggregate({
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: startOfMonth, lt: endOfMonth },
    },
    _sum: { amount: true },
  });

  const totalIncome = await prisma.expense.aggregate({
    where: { userId, type: 'INCOME', date: { gte: startOfMonth, lt: endOfMonth } },
    _sum: { amount: true },
  });

  const totalExpenses = await prisma.expense.aggregate({
    where: { userId, type: 'EXPENSE', date: { gte: startOfMonth, lt: endOfMonth } },
    _sum: { amount: true },
  });

  const allTimeIncome = await prisma.expense.aggregate({
    where: { userId, type: 'INCOME' },
    _sum: { amount: true },
  });

  const allTimeExpenses = await prisma.expense.aggregate({
    where: { userId, type: 'EXPENSE' },
    _sum: { amount: true },
  });

  const balance = (allTimeIncome._sum.amount || 0) - (allTimeExpenses._sum.amount || 0);
  const currentMonthExpenses = monthlyExpenses._sum.amount || 0;

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-24">
      {/* Top Header Card in Dark Gradient */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 px-6 pt-12 pb-16 text-white -mx-6 -mt-12 rounded-b-[3rem] shadow-2xl relative z-0">
        {/* Header Profile */}
        <div className="flex justify-between items-center mb-8 relative z-50">
          <div className="flex items-center gap-3">
            <UserButton appearance={{ elements: { avatarBox: "w-12 h-12 border-2 border-white/20 shadow-lg" } }} />
            <DateSelector currentDate={currentFormattedDate} />
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white shadow-sm border border-white/10 transition-all">
              <ThemeToggle />
            </div>
            <NotificationBell />
          </div>
        </div>

        {/* Main Balance Card */}
        <div className="text-center text-white mb-4">
          <p className="text-white/75 text-sm font-medium mb-1 tracking-wide uppercase text-xs">Current Balance</p>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
          <div className={`inline-flex items-center gap-1 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold rounded-full border shadow-sm ${
            weeklyDiff < 0 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/25' 
              : weeklyDiff > 0 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/25' 
                : 'bg-white/10 text-white/80 border-white/10'
          }`}>
            {weeklyDiff < 0 ? (
              <>
                <ArrowDownRight className="w-3.5 h-3.5" />
                ₹{Math.abs(weeklyDiff).toLocaleString('en-IN')} less than last week
              </>
            ) : weeklyDiff > 0 ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" />
                ₹{weeklyDiff.toLocaleString('en-IN')} more than last week
              </>
            ) : (
              'No change in weekly expenses'
            )}
          </div>
        </div>
      </div>

      {/* White Sheet Content */}
      <div className="bg-white/95 dark:bg-slate-950 backdrop-blur-xl rounded-t-[3rem] -mx-6 px-6 pt-10 pb-32 flex-grow shadow-[0_-20px_50px_rgba(0,0,0,0.1)] -mt-8 relative z-10 border-t border-white/20 dark:border-slate-800">
        
        {/* Income / Expense Cards */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Your Money
            <span className="text-muted-foreground text-xs font-normal bg-muted px-2 py-0.5 rounded-full">i</span>
          </h2>
          <Link href="/report" className="text-xs font-medium text-muted-foreground flex items-center bg-muted/60 hover:bg-muted transition-colors px-3 py-1.5 rounded-full">
            Details <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-none shadow-sm bg-[#F8FAFC] dark:bg-slate-800/50">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-500">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Income</p>
                <p className="text-xl font-bold">₹{(totalIncome._sum.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-[#FFF1F2] dark:bg-rose-950/20">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Expenses</p>
                <p className="text-xl font-bold">₹{(totalExpenses._sum.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight Banner */}
        <Link href="/insights" className="bg-[#111827] text-white rounded-2xl p-4 flex justify-between items-center mb-8 shadow-lg shadow-black/10 hover:bg-[#1f2937] transition-colors block">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <span className="font-medium text-sm">Your AI insight is ready</span>
          </div>
          <div className="text-xs text-white/80 flex items-center">
            View <ArrowUpRight className="w-3 h-3 ml-1" />
          </div>
        </Link>

        {/* Transactions List */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">Transactions</h2>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link href="/report"><ArrowDownRight className="w-4 h-4 hover:text-foreground transition-colors" /></Link>
            <Link href="/report"><BarChart2 className="w-4 h-4 hover:text-foreground transition-colors" /></Link>
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">For the Period</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
          <span>Recent</span>
          <span>Total ₹{currentMonthExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No transactions yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
                You haven't recorded any expenses or income for this period.
              </p>
              <Link href="/add" className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full shadow-sm hover:bg-primary/90 transition-colors">
                Add Transaction
              </Link>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-border/50 shadow-sm rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shadow-sm" style={{ backgroundColor: `${transaction.category?.color}15` }}>
                    <div style={{ color: transaction.category?.color }}>
                      {transaction.category ? iconMap[transaction.category.name] || <Wallet className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-0.5">{transaction.description}</h3>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      {transaction.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className={`font-bold ${transaction.type === 'INCOME' ? 'text-emerald-500' : 'text-foreground'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {new Date(transaction.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <TransactionActions transactionId={transaction.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
