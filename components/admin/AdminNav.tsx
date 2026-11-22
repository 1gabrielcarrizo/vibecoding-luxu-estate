"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { NotificationsDropdown } from "@/components/common/NotificationsDropdown";
import { LanguageSelector } from "@/components/common/LanguageSelector";

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
  const { t } = useTranslation();
  const {
    email: authEmail,
    displayName: authName,
    avatarUrl: authAvatar,
    signOut,
  } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const email = authEmail || initialEmail || null;
  const name =
    authName || initialName || (email ? email.split("@")[0] : null);
  const avatar = authAvatar || initialAvatar || null;

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const isUsers = pathname.startsWith("/admin/users");
  const isProperties =
    pathname.startsWith("/admin/properties") || pathname === "/admin";

  return (
    <nav className="sticky top-0 z-50 bg-card-white dark:bg-[#152e2a] border-b border-nordic/5 dark:border-primary/20 backdrop-blur-md bg-opacity-95 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Brand & Nav items */}
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Logo & Company Name links to public home page */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group cursor-pointer focus:outline-none"
            title={t("admin.nav.goHomeTitle")}
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
              {t("admin.nav.listings")}
            </Link>
            <Link
              href="/admin/users"
              className={`px-1 py-2 text-sm font-medium transition-colors ${
                isUsers
                  ? "text-primary border-b-2 border-primary font-semibold"
                  : "text-nordic/60 dark:text-gray-400 hover:text-primary"
              }`}
            >
              {t("admin.nav.users")}
            </Link>
          </div>
        </div>

        {/* Right Nav / Language, Search, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Selector (desktop) */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          <Link
            href="/?focus=search"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-nordic/60 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={t("admin.nav.searchListings")}
            aria-label={t("admin.nav.searchListings")}
          >
            <span className="material-symbols-outlined text-xl leading-none select-none flex items-center justify-center">
              search
            </span>
          </Link>

          <NotificationsDropdown variant="admin" />

          {/* User Profile Button with Dropdown & Sign Out */}
          <div
            ref={dropdownRef}
            className="relative flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-nordic/10 dark:border-gray-700"
          >
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-none group"
              title={t("admin.nav.profileOptions")}
              aria-label={t("admin.nav.profileOptions")}
              aria-expanded={profileOpen}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-nordic dark:text-white truncate max-w-[130px] group-hover:text-primary transition-colors">
                  {name || t("nav.userFallback")}
                </span>
                <span className="text-xs text-nordic/60 dark:text-gray-400">
                  {t("admin.nav.premiumAdmin")}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-mosque/15 overflow-hidden ring-2 ring-white dark:ring-primary/20 border border-mosque/20 transition-transform group-hover:scale-105 flex items-center justify-center">
                {avatar ? (
                  <img
                    alt={name || t("admin.nav.premiumAdmin")}
                    className="h-full w-full object-cover"
                    src={avatar}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-mosque">
                    {(name || "A").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-white dark:bg-[#152e2a] shadow-dropdown border border-nordic/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-nordic/10 dark:border-gray-700">
                  <p className="text-xs text-nordic/50 dark:text-gray-400">
                    {t("admin.nav.signedInAs")}
                  </p>
                  <p className="text-sm font-semibold text-nordic dark:text-white truncate">
                    {email || "admin@luxeestate.com"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      person
                    </span>
                    <span>{t("admin.nav.myProfile")}</span>
                  </Link>
                  <Link
                    href="/admin/properties"
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      apartment
                    </span>
                    <span>{t("admin.nav.manageProperties")}</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      manage_accounts
                    </span>
                    <span>{t("admin.nav.userDirectory")}</span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-nordic/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      home
                    </span>
                    <span>{t("admin.nav.publicHome")}</span>
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
                  <span>{t("admin.nav.signOut")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-nordic/70 dark:text-gray-300 hover:bg-nordic/5 cursor-pointer ml-1"
            aria-label={t("nav.toggleMenuAria")}
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
          mobileMenuOpen ? "max-h-[28rem] py-3" : "max-h-0 py-0"
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
            <span>{t("admin.nav.listings")}</span>
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
            <span className="material-symbols-outlined text-lg">
              manage_accounts
            </span>
            <span>{t("admin.nav.users")}</span>
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-nordic/70 dark:text-gray-300 hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">person</span>
            <span>{t("admin.nav.myProfile")}</span>
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-nordic/70 dark:text-gray-300 hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            <span>{t("admin.nav.goToWebsite")}</span>
          </Link>

          <LanguageSelector variant="mobile" className="mt-2" />
        </div>
      </div>
    </nav>
  );
};
