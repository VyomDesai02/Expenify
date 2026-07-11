import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, ChevronDown, MoreHorizontal, Coffee, ShoppingBag, Plane, Receipt, Film, Wallet, BarChart2 } from 'lucide-react';
import { DateSelector } from '@/components/DashboardActions';

// For simplicity in this demo, we'll use regular divs to mimic the Recharts donut chart layout
// as Recharts in App Router requires 'use client' and complex setup. We can enhance it later.

const iconMap: Record<string, React.ReactNode> = {
  Food: <Coffee className="h-5 w-5" />,
  Shopping: <ShoppingBag className="h-5 w-5" />,
  Travel: <Plane className="h-5 w-5" />,
  Bills: <Receipt className="h-5 w-5" />,
  Entertainment: <Film className="h-5 w-5" />,
  Other: <MoreHorizontal className="h-5 w-5" />,
};

export default async function ReportPage(props: { searchParams?: Promise<{ tab?: string, month?: string }> }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

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
  
  const currentFormattedDate = startOfMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const isIncome = searchParams.tab === 'income';
  const type = isIncome ? 'INCOME' : 'EXPENSE';

  // Group expenses by category for the current month
  const expensesByCategory = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      type: type,
      date: { gte: startOfMonth, lt: endOfMonth },
    },
    _sum: {
      amount: true,
    },
  });

  const categories = await prisma.category.findMany();
  
  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + (item._sum.amount || 0), 0);

  const reportData = expensesByCategory.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    const amount = item._sum.amount || 0;
    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
    return {
      category: category?.name || 'Uncategorized',
      color: category?.color || '#cbd5e1',
      amount,
      percentage,
    };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-24 bg-background text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-bold">Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <DateSelector currentDate={currentFormattedDate} isLight={true} />
          <div className="bg-muted/50 rounded-full">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/30 p-1 rounded-full mb-8">
        <Link href="/report?tab=expenses" className={`flex-1 text-center font-bold py-3 rounded-full text-sm ${!isIncome ? 'bg-white dark:bg-slate-800 shadow-sm text-foreground' : 'text-muted-foreground font-medium'}`}>
          Expenses
        </Link>
        <Link href="/report?tab=income" className={`flex-1 text-center font-bold py-3 rounded-full text-sm ${isIncome ? 'bg-white dark:bg-slate-800 shadow-sm text-foreground' : 'text-muted-foreground font-medium'}`}>
          Income
        </Link>
      </div>

      {/* Chart Area Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">{isIncome ? 'Income' : 'Expenses'} Report</h2>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center bg-muted/50 rounded-full">
            <span className="w-3 h-3 bg-muted-foreground/40 rounded-sm"></span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full">
            <span className="w-3 h-3 border-2 border-primary rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Chart (Visual Mockup based on design) */}
      <div className="relative flex justify-center items-center py-12 mb-8">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {reportData.map((data, index) => {
              // Simplified SVG donut chart generation
              let cumulativePercent = reportData.slice(0, index).reduce((acc, item) => acc + item.percentage, 0);
              const strokeDasharray = `${data.percentage} 100`;
              const strokeDashoffset = -cumulativePercent;
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={data.color}
                  strokeWidth="15"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Total {isIncome ? 'Income' : 'Expenses'}</p>
            <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          {/* Tooltip mockup */}
          <div className="absolute top-1/4 right-0 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-md shadow-lg transform translate-x-4">
            31%
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex justify-between text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
        <span>All {isIncome ? 'Income' : 'Expenses'}</span>
        <span>Total ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>

      {/* List */}
      <div className="space-y-6">
        {reportData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/30 rounded-3xl border border-dashed border-border mt-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <BarChart2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No data available</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
              You don't have any {isIncome ? 'income' : 'expenses'} recorded for this month.
            </p>
            <Link href="/add" className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full shadow-sm hover:bg-primary/90 transition-colors">
              Add {isIncome ? 'Income' : 'Expense'}
            </Link>
          </div>
        ) : (
          reportData.map((data, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${data.color}15`, color: data.color }}>
                    {iconMap[data.category] || <Wallet className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-0.5">{data.category}</h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {data.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground mb-0.5">
                    ₹{data.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs font-medium text-emerald-500">
                    +12% vs last month
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${data.percentage}%`, backgroundColor: data.color }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
