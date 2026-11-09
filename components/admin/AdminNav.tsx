"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(initialEmail || null);
  const [name, setName] = useState<string | null>(initialName || null);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar || null);

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    router.push("/login");
    router.refresh();
  };

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
          {/* Logo & Company Name links to public home page */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group cursor-pointer focus:outline-none"
            title="Ir a la página principal"
          >
            <span className="material-symbols-outlined text-primary text-2xl transition-transform duration-300 group-hover:scale-110">
              apartment
            </span>
            <span className="font-bold text-lg text-nordic dark:text-white tracking-tight">
              LuxeEstate
            </span>
          </Link>

          {/* Navigation Links (Listings & Users) */}
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
          </div>
        </div>

        {/* Right Nav / Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
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

          {/* User Profile Button with Dropdown & Sign Out */}
          <div
            ref={dropdownRef}
            className="relative flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-nordic/10 dark:border-gray-700"
          >
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-none group"
              title="Opciones de perfil"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-nordic dark:text-white truncate max-w-[130px] group-hover:text-primary transition-colors">
                  {name || (email ? email.split("@")[0] : "Alex Morgan")}
                </span>
                <span className="text-xs text-nordic/60 dark:text-gray-400">
                  Premium Admin
                </span>
              </div>
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-nordic/10 overflow-hidden ring-2 ring-white dark:ring-primary/20 border border-nordic/10 transition-transform group-hover:scale-105">
                <img
                  alt="Admin user avatar"
                  className="h-full w-full object-cover"
                  src={avatar || defaultAvatar}
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-white dark:bg-[#152e2a] shadow-dropdown border border-nordic/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-nordic/10 dark:border-gray-700">
                  <p className="text-xs text-nordic/50 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold text-nordic dark:text-white truncate">
                    {email || "admin@luxeestate.com"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/properties"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Manage Properties
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    User Directory
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Public Home Page
                  </Link>
                </div>

                <div className="border-t border-nordic/10 dark:border-gray-700 my-1" />

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-icons text-base">logout</span>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-nordic/70 dark:text-gray-300 hover:bg-nordic/5 cursor-pointer ml-1"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden border-t border-nordic/10 dark:border-primary/20 bg-card-white dark:bg-[#152e2a] overflow-hidden transition-all duration-200 ${
          mobileMenuOpen ? "max-h-64 py-3" : "max-h-0 py-0"
        }`}
      >
        <div className="space-y-1 px-2">
          <Link
            href="/admin/properties"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isProperties
                ? "bg-primary/10 text-primary font-semibold"
                : "text-nordic/70 dark:text-gray-300 hover:bg-primary/5"
            }`}
          >
            <span className="material-symbols-outlined text-lg">apartment</span>
            <span>Listings (Propiedades)</span>
          </Link>
          <Link
            href="/admin/users"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isUsers
                ? "bg-primary/10 text-primary font-semibold"
                : "text-nordic/70 dark:text-gray-300 hover:bg-primary/5"
            }`}
          >
            <span className="material-symbols-outlined text-lg">manage_accounts</span>
            <span>Users (Usuarios)</span>
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-nordic/70 dark:text-gray-300 hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            <span>Ir al Sitio Web</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
