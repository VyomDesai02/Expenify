'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createTransaction } from '@/lib/actions';
import { toast } from 'sonner';

export default function AddTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(''); // We'll hardcode one or fetch them
  const [loading, setLoading] = useState(false);

  // Hardcoded categories for demo matching our seed
  const categories = [
    { id: 'cm0...1', name: 'Food' },
    { id: 'cm0...2', name: 'Shopping' },
    { id: 'cm0...3', name: 'Travel' },
    { id: 'cm0...4', name: 'Bills' },
    { id: 'cm0...5', name: 'Entertainment' },
    { id: 'cm0...6', name: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createTransaction({
        amount: parseFloat(amount),
        description,
        type,
        categoryName: categories.find(c => c.id === categoryId)?.name || 'Other'
      });
      toast.success('Transaction added successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center p-6 border-b border-border/40 bg-white dark:bg-slate-950">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-8 text-foreground">New Transaction</h1>
      </div>

      <div className="flex bg-muted p-1 m-6 rounded-full">
        <button 
          onClick={() => setType('EXPENSE')}
          className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${type === 'EXPENSE' ? 'bg-white dark:bg-slate-800 shadow-sm text-foreground' : 'text-muted-foreground'}`}
        >
          Expense
        </button>
        <button 
          onClick={() => setType('INCOME')}
          className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${type === 'INCOME' ? 'bg-white dark:bg-slate-800 shadow-sm text-foreground' : 'text-muted-foreground'}`}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pb-24">
        <div className="flex flex-col items-center justify-center py-8">
          <span className="text-muted-foreground font-medium mb-2">Amount</span>
          <div className="flex items-center text-5xl font-bold text-foreground">
            <span className="text-3xl text-muted-foreground mr-1">₹</span>
            <input 
              type="number" 
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent border-none outline-none w-full max-w-[200px] text-center"
            />
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Description</label>
            <input 
              type="text" 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full bg-white dark:bg-slate-900 border border-border/50 rounded-2xl p-4 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            />
          </div>

          {type === 'EXPENSE' && (
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Category</label>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-border/50 rounded-2xl p-4 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none text-foreground"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
