import { BottomNav } from '@/components/shared/BottomNav';
import { Sidebar } from '@/components/shared/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col md:flex-row">
      {/* Decorative gradient blobs based on design */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent -z-10 pointer-events-none" />
      
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex shrink-0" />

      {/* Main Workspace */}
      <main className="flex-1 w-full min-h-screen relative md:pb-0 pb-20 max-w-md mx-auto md:max-w-4xl lg:max-w-5xl shadow-xl shadow-black/5 sm:border-x sm:border-border/50 md:border-none md:shadow-none bg-card/5 backdrop-blur-3xl md:bg-transparent">
        <div className="w-full h-full">
          {children}
        </div>
        <BottomNav />
      </main>
    </div>
  );
}
