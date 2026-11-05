import React from "react";
import { Navbar } from "@/components/common/Navbar";

export default function PropertyLoading() {
  return (
    <div className="min-h-screen bg-clear-day text-nordic flex flex-col font-display">
      <Navbar isDetailPage={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-nordic/10 rounded mb-6"></div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
            <div className="flex gap-4 overflow-hidden pb-2">
              <div className="w-48 aspect-[4/3] bg-slate-200 rounded-lg flex-none"></div>
              <div className="w-48 aspect-[4/3] bg-slate-200 rounded-lg flex-none"></div>
              <div className="w-48 aspect-[4/3] bg-slate-200 rounded-lg flex-none"></div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-mosque/5 space-y-4">
              <div className="h-10 w-48 bg-slate-200 rounded"></div>
              <div className="h-4 w-64 bg-slate-200 rounded"></div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="h-12 bg-slate-200 rounded-lg mt-6"></div>
              <div className="h-12 bg-slate-200 rounded-lg"></div>
            </div>

            <div className="bg-white p-2 rounded-xl border border-mosque/5">
              <div className="aspect-[4/3] bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-mosque/5 h-48 bg-slate-100"></div>
            <div className="bg-white p-8 rounded-xl border border-mosque/5 h-40 bg-slate-100"></div>
            <div className="bg-white p-8 rounded-xl border border-mosque/5 h-40 bg-slate-100"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

