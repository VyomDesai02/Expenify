export default function ReportLoading() {
  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-24 bg-background animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-md bg-muted-foreground/20" />
          <div className="w-24 h-6 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 rounded-full bg-muted-foreground/20" />
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/30 p-1 rounded-full mb-8 h-12" />

      {/* Chart Area Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-32 h-6 rounded-full bg-muted-foreground/20" />
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="relative flex justify-center items-center py-12 mb-8">
        <div className="w-64 h-64 rounded-full border-[15px] border-muted-foreground/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-20 h-3 rounded-full bg-muted-foreground/20 mb-2" />
          <div className="w-28 h-8 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      {/* List Header */}
      <div className="flex justify-between mb-4">
        <div className="w-24 h-4 rounded-full bg-muted-foreground/20" />
        <div className="w-24 h-4 rounded-full bg-muted-foreground/20" />
      </div>

      {/* List */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted-foreground/10" />
                <div>
                  <div className="w-24 h-4 rounded-full bg-muted-foreground/20 mb-2" />
                  <div className="w-16 h-3 rounded-full bg-muted-foreground/10" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-20 h-4 rounded-full bg-muted-foreground/20 mb-2" />
                <div className="w-16 h-3 rounded-full bg-muted-foreground/10" />
              </div>
            </div>
            <div className="h-2 w-full bg-muted-foreground/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
