"use client";

import React from "react";

interface FavoritesSkeletonProps {
  count?: number;
  viewMode?: "grid" | "list";
}

export const FavoriteCardSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full opacity-60">
    <div className="h-64 bg-slate-200 w-full" />
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-slate-200 w-1/3 rounded" />
        <div className="h-5 bg-slate-200 w-16 rounded" />
      </div>
      <div className="h-4 bg-slate-200 w-2/3 rounded mb-6" />
      <div className="flex justify-between mb-8">
        <div className="h-4 bg-slate-200 w-12 rounded" />
        <div className="h-4 bg-slate-200 w-12 rounded" />
        <div className="h-4 bg-slate-200 w-12 rounded" />
      </div>
      <div className="mt-auto">
        <div className="h-10 bg-slate-200 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export const FavoritesSkeleton: React.FC<FavoritesSkeletonProps> = ({
  count = 4,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: Math.min(count, 3) }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row opacity-60"
          >
            <div className="h-56 sm:h-auto sm:w-72 md:w-80 bg-slate-200 flex-shrink-0" />
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 bg-slate-200 w-32 rounded" />
                  <div className="h-5 bg-slate-200 w-20 rounded" />
                </div>
                <div className="h-4 bg-slate-200 w-1/2 rounded mb-2" />
                <div className="h-4 bg-slate-200 w-2/3 rounded" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-6">
                  <div className="h-4 bg-slate-200 w-14 rounded" />
                  <div className="h-4 bg-slate-200 w-14 rounded" />
                  <div className="h-4 bg-slate-200 w-16 rounded" />
                </div>
                <div className="h-10 bg-slate-200 w-36 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <FavoriteCardSkeleton key={idx} />
      ))}
    </div>
  );
};
