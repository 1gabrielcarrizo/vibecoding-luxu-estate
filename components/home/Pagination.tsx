"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-nordic-dark/10 pt-6">
      {/* Items count summary */}
      <div className="text-sm text-nordic-muted">
        Showing <span className="font-medium text-nordic-dark">{startItem}</span> to{" "}
        <span className="font-medium text-nordic-dark">{endItem}</span> of{" "}
        <span className="font-medium text-nordic-dark">{totalCount}</span> properties
      </div>

      {/* Pagination Controls */}
      <nav
        aria-label="Pagination"
        className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-nordic-dark/10 shadow-xs"
      >
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-nordic-dark hover:bg-clear-day disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Previous page"
        >
          <span className="material-icons text-base">chevron_left</span>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 px-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-sm text-nordic-muted select-none"
                >
                  …
                </span>
              );
            }

            const pageNum = Number(p);
            const isCurrent = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-nordic-dark text-white shadow-xs"
                    : "text-nordic-dark hover:bg-clear-day"
                } disabled:cursor-not-allowed`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-nordic-dark hover:bg-clear-day disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="material-icons text-base">chevron_right</span>
        </button>
      </nav>
    </div>
  );
};
