import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";

export default function ScheduleVisitLoading() {
  return (
    <div className="bg-clear-day min-h-screen flex flex-col font-display text-nordic">
      <Navbar isDetailPage={true} />
      <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-8">
        <div className="w-full max-w-6xl mb-6 animate-pulse">
          <div className="h-5 w-48 bg-slate-200 rounded" />
        </div>

        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl shadow-mosque/5 overflow-hidden flex flex-col md:flex-row border border-slate-100 animate-pulse">
          <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 lg:p-10 flex flex-col gap-6">
            <div className="aspect-[4/3] w-full bg-slate-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-7 bg-slate-200 w-3/4 rounded" />
              <div className="h-4 bg-slate-200 w-1/2 rounded" />
              <div className="h-16 bg-slate-200/70 w-full rounded" />
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-200 w-20 rounded" />
                  <div className="h-4 bg-slate-200 w-32 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 p-6 md:p-8 lg:p-10 space-y-6">
            <div>
              <div className="h-9 bg-slate-200 w-64 rounded mb-2" />
              <div className="h-4 bg-slate-200 w-80 rounded" />
            </div>
            <div className="h-56 bg-slate-100 rounded-xl" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-lg" />
              ))}
            </div>
            <div className="h-24 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </main>
      <PropertyFooter />
    </div>
  );
}
