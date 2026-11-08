import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifyIsAdmin, getAdminUsersAction } from "@/app/actions/roles";
import { getAllPropertiesForAdmin } from "@/lib/supabase/properties";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

async function AdminContent() {
  // Double-check admin access on server-side
  const { isAdmin, userId, userEmail } = await verifyIsAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  // Concurrently fetch properties and user roles
  const [properties, usersResult] = await Promise.all([
    getAllPropertiesForAdmin(),
    getAdminUsersAction(),
  ]);

  return (
    <AdminDashboard
      initialProperties={properties}
      initialUsers={usersResult.users || []}
      currentUserId={userId}
      currentUserEmail={userEmail}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-white/80 rounded-2xl border border-mosque/10" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
            <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
            <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
            <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
            <div className="h-20 bg-white/80 rounded-xl border border-mosque/10" />
          </div>
          <div className="h-96 bg-white/80 rounded-xl border border-mosque/10" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
