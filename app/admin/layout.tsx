import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Administrativo — LuxeEstate",
  description:
    "Gestión integral de propiedades y control de roles de usuarios en LuxeEstate.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F9F9] text-nordic flex flex-col font-display antialiased">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mosque/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              title="Volver a la tienda"
            >
              <span className="material-symbols-outlined text-mosque text-2xl font-bold transition-transform duration-300 group-hover:scale-110">
                villa
              </span>
              <span className="font-bold text-lg tracking-tight text-nordic">
                LuxeEstate
              </span>
            </Link>

            <span className="h-4 w-px bg-mosque/20"></span>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mosque/10 text-mosque text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">
                shield_person
              </span>
              <span>Panel Administrativo</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-nordic/70 hover:text-mosque px-3 py-1.5 rounded-lg hover:bg-mosque/5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              <span>Ir al Sitio Público</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-mosque/10 bg-white/60 py-4 text-center text-xs text-nordic/50">
        LuxeEstate Control Panel • Sistema de Gestión de Propiedades y Roles RBAC
      </footer>
    </div>
  );
}

