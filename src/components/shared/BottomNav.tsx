'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Sparkles, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Report', href: '/report', icon: BarChart2 },
  { name: 'Add', href: '/add', icon: Plus, isAdd: true },
  { name: 'Insights', href: '/insights', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/40 pb-safe pt-2 px-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.06)] z-50 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isAdd) {
            return (
              <div key="add-button" className="relative flex justify-center items-center w-12 h-12">
                <Link
                  href="/add"
                  aria-label="Add transaction"
                  className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 border-4 border-card"
                >
                  <Plus className="h-6 w-6" />
                </Link>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 gap-1 transition-all active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative flex items-center justify-center p-1.5 rounded-xl">
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 z-10", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn("text-[9px] font-semibold tracking-wide transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
