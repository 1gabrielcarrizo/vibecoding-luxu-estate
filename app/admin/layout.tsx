import React from "react";
import { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin Panel — LuxeEstate",
  description:
    "Gestión integral de propiedades y directorio de usuarios en LuxeEstate.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-nordic dark:text-gray-100 font-display min-h-screen flex flex-col antialiased">
      <AdminNav />
      <div className="flex-grow flex flex-col">{children}</div>
    </div>
  );
}
