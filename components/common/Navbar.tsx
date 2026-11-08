"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/supabase/AuthContext";
import { LanguageSelector } from "./LanguageSelector";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearchClick?: () => void;
  isDetailPage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = "Buy",
  onTabChange,
  onSearchClick,
  isDetailPage = false,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    user,
    avatarUrl,
    displayName,
    email,
    provider,
    signOut,
    isLoading,
    isAdmin,
    role,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const navLinks = [
    { key: "Buy", label: t("nav.buy"), href: "/?tab=Buy" },
    { key: "Rent", label: t("nav.rent"), href: "/?tab=Rent" },
    { key: "Sell", label: t("nav.sell"), href: "/?tab=Sell" },
    { key: "Saved Homes", label: t("nav.savedHomes"), href: "/#saved" },
  ];

  const handleLinkClick = (tabKey: string, href: string) => {
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      router.push(href);
    }
  };

  const handleSearchAction = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      router.push("/?focus=search");
    }
  };

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-clear-day/95 backdrop-blur-md border-b border-mosque/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Company Brand - Returns to Home */}
          <Link
            href="/"
            onClick={() => onTabChange?.("Buy")}
            className="flex-shrink-0 flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="Return to LuxeEstate home"
          >
            <span className="material-symbols-outlined text-mosque text-3xl font-bold transition-transform duration-300 group-hover:scale-110">
              villa
            </span>
            <span className="font-bold text-xl tracking-tight text-nordic">
              LuxeEstate
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive =
                !isDetailPage &&
                (activeTab === link.key || activeTab === link.label);
              return (
                <button
                  key={link.key}
                  type="button"
                  onClick={() => handleLinkClick(link.key, link.href)}
                  className={`relative py-2 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "text-nordic"
                      : "text-nordic/70 hover:text-mosque"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mosque"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <LanguageSelector />

            <button
              onClick={handleSearchAction}
              aria-label={t("nav.searchAria")}
              className="p-2 text-nordic hover:text-mosque transition-colors rounded-full hover:bg-mosque/5 cursor-pointer"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            <button
              aria-label={t("nav.notificationsAria")}
              className="p-2 text-nordic hover:text-mosque transition-colors relative rounded-full hover:bg-mosque/5 cursor-pointer"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full"></span>
            </button>

            {/* User Profile or Sign In Button */}
            {isLoading ? (
              <div className="ml-1 sm:ml-2 w-9 h-9 rounded-full bg-mosque/10 animate-pulse border border-mosque/20" />
            ) : user ? (
              <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-label={t("nav.profileAria")}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-mosque/30 transition-all cursor-pointer focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-mosque/10 overflow-hidden border border-mosque/20 flex items-center justify-center text-nordic font-semibold">
                    {avatarUrl ? (
                      <img
                        alt={displayName || "User profile"}
                        className="w-full h-full object-cover"
                        src={avatarUrl}
                      />
                    ) : (
                      <span className="text-sm text-mosque">
                        {displayName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </button>

                {/* Profile Popover Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#152e2a] shadow-lg border border-mosque/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-mosque/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-mosque/10 overflow-hidden border border-mosque/20 flex-shrink-0 flex items-center justify-center">
                        {avatarUrl ? (
                          <img
                            alt={displayName || "User"}
                            className="w-full h-full object-cover"
                            src={avatarUrl}
                          />
                        ) : (
                          <span className="text-base font-bold text-mosque">
                            {displayName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-nordic dark:text-white truncate">
                          {displayName || "User"}
                        </p>
                        <p className="text-xs text-nordic/60 dark:text-gray-400 truncate">
                          {email || "Signed in"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {provider && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-mosque/10 text-mosque dark:bg-mosque/20 dark:text-accent capitalize">
                              {provider}
                            </span>
                          )}
                          {role && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-nordic/10 text-nordic dark:bg-white/10 dark:text-white capitalize">
                              {role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-mosque font-semibold hover:bg-mosque/10 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            admin_panel_settings
                          </span>
                          <span>Panel Admin</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          logout
                        </span>
                        {t("nav.signOut") || "Sign Out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 sm:ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-mosque bg-mosque/10 hover:bg-mosque hover:text-white rounded-full transition-all border border-mosque/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  login
                </span>
                <span>{t("nav.signIn") || "Sign In"}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-nordic hover:text-mosque p-2 rounded-md hover:bg-mosque/5 cursor-pointer"
              aria-label={t("nav.toggleMenuAria")}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden border-t border-mosque/10 bg-clear-day overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-[30rem] py-3" : "max-h-0 py-0"
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              !isDetailPage &&
              (activeTab === link.key || activeTab === link.label);
            return (
              <button
                key={link.key}
                onClick={() => {
                  handleLinkClick(link.key, link.href);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "text-mosque bg-mosque/10 font-semibold"
                    : "text-nordic hover:bg-mosque/5"
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* User Auth Section in Mobile Menu */}
          <div className="pt-3 mt-3 border-t border-mosque/10">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-mosque/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-mosque/10 overflow-hidden border border-mosque/20 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        alt={displayName || "User"}
                        className="w-full h-full object-cover"
                        src={avatarUrl}
                      />
                    ) : (
                      <span className="text-sm font-bold text-mosque">
                        {displayName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-nordic truncate">
                      {displayName || "User"}
                    </p>
                    <p className="text-xs text-nordic/60 truncate">
                      {email || "Signed in"}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm text-mosque font-semibold hover:bg-mosque/10 rounded-md flex items-center gap-2 cursor-pointer mb-1"
                  >
                    <span className="material-symbols-outlined text-lg">
                      admin_panel_settings
                    </span>
                    <span>Panel Administrador</span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  {t("nav.signOut") || "Sign Out"}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-mosque text-white font-semibold text-sm transition-colors hover:bg-primary-hover shadow-sm"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>{t("nav.signIn") || "Sign In"}</span>
              </Link>
            )}
          </div>

          {/* Mobile Language Selector */}
          <LanguageSelector variant="mobile" className="mt-3" />
        </div>
      </div>
    </nav>
  );
};
