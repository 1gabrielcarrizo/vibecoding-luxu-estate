import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllActiveProperties } from "@/lib/supabase/properties";
import { UserProfileScreen } from "@/components/profile/UserProfileScreen";
import ProfileLoading from "./loading";

export const metadata: Metadata = {
  title: "User Profile — LuxeEstate",
  description:
    "Manage your saved properties, upcoming scheduled visits, and account preferences on LuxeEstate.",
};

async function ProfileContent() {
  const allProperties = await getAllActiveProperties();
  return <UserProfileScreen allProperties={allProperties} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}
