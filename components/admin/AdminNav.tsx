"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface AdminNavProps {
  userEmail?: string | null;
  userName?: string | null;
  userAvatar?: string | null;
}

export const AdminNav: React.FC<AdminNavProps> = ({
  userEmail: initialEmail,
  userName: initialName,
  userAvatar: initialAvatar,
}) => {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(initialEmail || null);
  const [name, setName] = useState<string | null>(initialName || null);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar || null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || null);
          const metaName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0];
          setName(metaName || null);
          setAvatar(user.user_metadata?.avatar_url || null);
        }
      } catch (err) {
        console.warn("Could not fetch user in AdminNav:", err);
      }
    }
    if (!initialEmail) {
      loadUser();
    }
  }, [initialEmail]);

  const isUsers = pathname.startsWith("/admin/users");
  const isProperties =
    pathname.startsWith("/admin/properties") || pathname === "/admin";

  const defaultAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDOGZK5Jq_Tqk2BeXWfDxdvC2hZTk8NkXNHZOtopr3wzo5wRJePwR6Et_adclI555nmrESUtcgsw4X_Ma93qr0_RpbhJZUwJoP9VlTB7WwH1rht3HXqwi_zi2VLEQKYYZaBo4jhEYrPpHFoX77JHQvI8E2FYvsCWf_zJATSQfBVzGa4e3uMQrTLGzBJZI0D3dpIcWbedg_0ArvWQZGCyPR8Xq5oTrWnb7D7Ge2geZrlnGgv7Fy_lu3486yJYbQ7Z2nt6HyEeUrDwrk";

  return (
    <nav className="sticky top-0 z-50 bg-card-white dark:bg-[#152e2a] border-b border-nordic/5 dark:border-primary/20 backdrop-blur-md bg-opacity-95 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Brand & Nav items */}
        <div className="flex items-center gap-10">
          <Link
            href="/admin/properties"
            className="flex-shrink-0 flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <span className="material-symbols-outlined text-primary text-2xl transition-transform duration-300 group-hover:scale-110">
              apartment
            </span>
            <span className="font-bold text-lg text-nordic dark:text-white tracking-tight">
              LuxeEstate
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link
              href="/admin/properties"
              className={`px-1 py-2 text-sm font-medium transition-colors ${
                isProperties
                  ? "text-primary border-b-2 border-primary font-semibold"
                  : "text-nordic/60 dark:text-gray-400 hover:text-primary"
              }`}
            >
              Listings
            </Link>
            <Link
              href="/admin/users"
              className={`px-1 py-2 text-sm font-medium transition-colors ${
                isUsers
                  ? "text-primary border-b-2 border-primary font-semibold"
                  : "text-nordic/60 dark:text-gray-400 hover:text-primary"
              }`}
            >
              Users
            </Link>
            <Link
              href="/"
              className="text-nordic/60 dark:text-gray-400 hover:text-primary px-1 py-2 text-sm font-medium transition-colors flex items-center gap-1"
            >
              <span>Public Site</span>
              <span className="material-icons text-xs">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Right Nav / Notifications & Profile */}
        <div className="flex items-center gap-4">
          <Link
            href="/#properties"
            className="text-nordic/60 dark:text-gray-400 hover:text-primary transition-colors p-1"
            title="Search listings"
          >
            <span className="material-symbols-outlined text-xl">search</span>
          </Link>

          <button
            type="button"
            className="text-nordic/60 dark:text-gray-400 hover:text-primary transition-colors relative p-1 cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#152e2a]" />
          </button>

          {/* User Profile */}
          <div className="relative flex items-center gap-3 pl-3 sm:pl-4 border-l border-nordic/10 dark:border-gray-700">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 cursor-pointer focus:outline-none"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-nordic dark:text-white truncate max-w-[130px]">
                  {name || (email ? email.split("@")[0] : "Alex Morgan")}
                </span>
                <span className="text-xs text-nordic/60 dark:text-gray-400">
                  Premium Admin
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-nordic/10 overflow-hidden ring-2 ring-white dark:ring-primary/20 border border-nordic/10">
                <img
                  alt="Admin user avatar"
                  className="h-full w-full object-cover"
                  src={avatar || defaultAvatar}
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-[#152e2a] shadow-dropdown border border-nordic/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-nordic/5">
                  <p className="text-xs text-nordic/50">Signed in as</p>
                  <p className="text-sm font-semibold text-nordic dark:text-white truncate">
                    {email || "admin@luxeestate.com"}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/properties"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-nordic/80 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Manage Properties
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-nordic/80 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    User Directory
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-nordic/80 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Return to Public Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
