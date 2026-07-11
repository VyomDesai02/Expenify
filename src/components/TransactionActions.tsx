'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/lib/actions';
import { toast } from 'sonner';

export function TransactionActions({ transactionId }: { transactionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      try {
        await deleteTransaction(transactionId);
        toast.success('Transaction deleted');
      } catch (error) {
        console.error("Failed to delete transaction", error);
        toast.error('Failed to delete transaction');
      } finally {
        setIsDeleting(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors active:scale-95"
        aria-label="More actions"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <Link 
            href={`/edit/${transactionId}`}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors text-foreground"
          >
            <Edit2 className="w-4 h-4 mr-3 text-muted-foreground" />
            Edit Transaction
          </Link>
          <div className="h-px bg-border/50 my-1 mx-2" />
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-rose-500 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
