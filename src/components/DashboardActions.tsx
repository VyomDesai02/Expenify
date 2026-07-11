"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative z-50">
      <button 
        onClick={() => setOpen(!open)}
        className="relative bg-white/10 hover:bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white shadow-sm border border-white/10 transition-all active:scale-95 cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {!open && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-slate-900 animate-pulse"></span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border/50 p-4">
          <h3 className="font-bold text-sm mb-2 text-foreground">Notifications</h3>
          <p className="text-xs text-muted-foreground">You're all caught up! No new notifications.</p>
        </div>
      )}
    </div>
  );
}

export function DateSelector({ currentDate, isLight = false }: { currentDate: string, isLight?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="relative flex items-center">
      <div className={`flex items-center backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer border ${isLight ? 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}>
        {currentDate}
      </div>
      <input 
        type="month" 
        title="Select Date"
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        onChange={(e) => {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set('month', e.target.value);
          router.push(`${pathname}?${newParams.toString()}`);
        }}
      />
    </div>
  );
}
