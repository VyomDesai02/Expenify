export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-24 animate-pulse">
      {/* Top Header Card Skeleton */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 px-6 pt-12 pb-16 -mx-6 -mt-12 rounded-b-[3rem] relative z-0">
        <div className="flex justify-between items-center mb-8 relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20" />
            <div className="w-32 h-8 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20" />
            <div className="w-10 h-10 rounded-full bg-white/20" />
          </div>
        </div>

        <div className="text-center mb-4 flex flex-col items-center">
          <div className="w-24 h-4 rounded-full bg-white/20 mb-2" />
          <div className="w-48 h-12 rounded-full bg-white/30 mb-4" />
          <div className="w-40 h-6 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white/95 dark:bg-slate-950 rounded-t-[3rem] -mx-6 px-6 pt-10 pb-32 flex-grow -mt-8 relative z-10 border-t border-white/20 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div className="w-32 h-6 rounded-full bg-muted-foreground/20" />
          <div className="w-20 h-6 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-28 rounded-2xl bg-muted-foreground/10" />
          <div className="h-28 rounded-2xl bg-muted-foreground/10" />
        </div>

        <div className="h-16 rounded-2xl bg-muted-foreground/10 mb-8" />

        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-6 rounded-full bg-muted-foreground/20" />
          <div className="w-24 h-6 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted-foreground/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
