import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { verifyIsAdmin, getAdminUsersAction } from "@/app/actions/roles";
import { AdminUsersView } from "@/components/admin/AdminUsersView";

export const metadata: Metadata = {
  title: "User Directory — LuxeEstate Admin",
  description: "Manage user access and roles for your properties.",
};

async function UsersContent() {
  const { isAdmin, userId, userEmail } = await verifyIsAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  const usersResult = await getAdminUsersAction();

  return (
    <AdminUsersView
      initialUsers={usersResult.users || []}
      currentUserId={userId}
      currentUserEmail={userEmail}
    />
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
          <div className="h-20 bg-white/60 rounded-xl" />
          <div className="h-64 bg-white/60 rounded-xl" />
          <div className="h-64 bg-white/60 rounded-xl" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}

