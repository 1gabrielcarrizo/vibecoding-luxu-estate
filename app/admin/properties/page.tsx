import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { connection } from "next/server";
import { verifyIsAdmin } from "@/app/actions/roles";
import { getAllPropertiesForAdmin } from "@/lib/supabase/properties";
import { AdminPropertiesView } from "@/components/admin/AdminPropertiesView";

export const metadata: Metadata = {
  title: "Property Management Dashboard — LuxeEstate Admin",
  description: "Manage your portfolio and track performance.",
};

async function PropertiesContent() {
  await connection();
  const { isAdmin } = await verifyIsAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  const properties = await getAllPropertiesForAdmin();

  return <AdminPropertiesView initialProperties={properties} />;
}

export default function AdminPropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
          <div className="h-16 bg-white/60 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-24 bg-white/60 rounded-xl" />
            <div className="h-24 bg-white/60 rounded-xl" />
            <div className="h-24 bg-white/60 rounded-xl" />
          </div>
          <div className="h-96 bg-white/60 rounded-xl" />
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
