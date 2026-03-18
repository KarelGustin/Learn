export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-zinc-800 rounded" />
      <div className="h-4 w-96 bg-zinc-800/50 rounded" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-zinc-800/30 rounded-xl border border-zinc-800" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="h-48 bg-zinc-800/30 rounded-xl border border-zinc-800" />
          <div className="h-64 bg-zinc-800/30 rounded-xl border border-zinc-800" />
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-zinc-800/30 rounded-xl border border-zinc-800" />
          <div className="h-48 bg-zinc-800/30 rounded-xl border border-zinc-800" />
        </div>
      </div>
    </div>
  )
}
