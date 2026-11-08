export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 bg-white/80 rounded-2xl border border-mosque/10" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
        <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
        <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
        <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
        <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
      </div>
      <div className="h-96 bg-white/80 rounded-xl border border-mosque/10" />
    </div>
  );
}

