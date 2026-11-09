import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { connection } from "next/server";
import { verifyIsAdmin } from "@/app/actions/roles";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const metadata: Metadata = {
  title: "Add New Property — LuxeEstate Admin",
  description: "Create and publish a new property listing.",
};

async function NewPropertyContent() {
  await connection();
  const { isAdmin } = await verifyIsAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return <PropertyForm isEdit={false} />;
}

export default function NewPropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
          <div className="h-16 bg-white/60 rounded-xl" />
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-6">
              <div className="h-48 bg-white/60 rounded-xl" />
              <div className="h-48 bg-white/60 rounded-xl" />
              <div className="h-64 bg-white/60 rounded-xl" />
            </div>
            <div className="xl:col-span-4 space-y-6">
              <div className="h-64 bg-white/60 rounded-xl" />
              <div className="h-64 bg-white/60 rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <NewPropertyContent />
    </Suspense>
  );
}

