export function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "#0e0f1c", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-1 skeleton" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-4 w-24" />
          <div className="flex-1" />
          <div className="skeleton h-4 w-12" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-4/5" />
        </div>
        <div className="space-y-1.5">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-5/6" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-9 w-32 rounded-xl" />
          <div className="skeleton h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
