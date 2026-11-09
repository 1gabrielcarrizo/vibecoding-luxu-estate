import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { connection } from "next/server";
import { verifyIsAdmin } from "@/app/actions/roles";
import { getPropertyById } from "@/lib/supabase/properties";
import { PropertyForm } from "@/components/admin/PropertyForm";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditPropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  return {
    title: property
      ? `Edit ${property.title} — LuxeEstate Admin`
      : "Edit Property — LuxeEstate Admin",
    description: "Edit property listing details and gallery.",
  };
}

async function EditPropertyContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const { isAdmin } = await verifyIsAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyForm initialData={property} isEdit={true} />;
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
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
      <EditPropertyContent params={params} />
    </Suspense>
  );
}

