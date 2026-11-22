import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";

export default function ProfileLoading() {
  return (
    <div className="bg-clear-day font-display text-nordic min-h-screen flex flex-col">
      <Navbar isDetailPage={true} />
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-8 lg:py-12 xl:py-16 max-w-7xl mx-auto w-full animate-pulse">
        <div className="bg-hint-green/70 p-8 rounded-3xl mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/70" />
            <div className="space-y-3">
              <div className="h-9 w-56 bg-white/70 rounded-lg" />
              <div className="h-4 w-64 bg-white/60 rounded" />
            </div>
          </div>
          <div className="h-20 w-72 bg-white/80 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-nordic/5"
            >
              <div className="h-64 bg-slate-200" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-slate-200 w-2/3 rounded" />
                <div className="h-4 bg-slate-200 w-1/2 rounded" />
                <div className="h-4 bg-slate-200 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <PropertyFooter />
    </div>
  );
}
