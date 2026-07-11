'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Sparkles, Settings, Plus, LogOut, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, SignOutButton } from '@clerk/nextjs';

interface SidebarProps {
  className?: string;
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Reports', href: '/report', icon: BarChart2 },
  { name: 'AI Insights', href: '/insights', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <aside className={cn(
      "w-64 bg-card border-r border-border/40 min-h-screen p-6 flex flex-col justify-between sticky top-0 shadow-sm z-30",
      className
    )}>
      {/* Upper section */}
      <div className="space-y-8">
        {/* App Logo & Branding */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-foreground text-sm tracking-wide uppercase">Expenify</h1>
            <p className="text-[10px] text-muted-foreground font-semibold">EXPENSE TRACKER</p>
          </div>
        </div>

        {/* CTA Button: Add Transaction */}
        <Link
          href="/add"
          className="flex items-center justify-center gap-2 w-full bg-gradient-primary hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile section */}
      {isLoaded && user && (
        <div className="border-t border-border/40 pt-5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img 
              src={user.imageUrl} 
              alt={user.firstName || "User"} 
              className="w-10 h-10 rounded-full border border-border/50 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {user.firstName || user.username}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          
          <SignOutButton redirectUrl="/sign-in">
            <button className="flex items-center justify-center gap-2.5 w-full bg-muted/50 hover:bg-rose-500/10 hover:text-rose-600 text-muted-foreground font-semibold py-2.5 rounded-xl transition-all text-xs border border-border/30 active:scale-[0.98] cursor-pointer">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </aside>
  );
}
