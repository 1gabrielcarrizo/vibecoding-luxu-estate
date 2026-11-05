"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { currentUser, navLinks } from "@/data/mockData";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (tabLabel: string, href: string) => {
    if (onTabChange) {
      onTabChange(tabLabel);
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
              const isActive = !isDetailPage && activeTab === link.label;
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleLinkClick(link.label, link.href)}
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSearchAction}
              aria-label="Search properties"
              className="p-2 text-nordic hover:text-mosque transition-colors rounded-full hover:bg-mosque/5 cursor-pointer"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            <button
              aria-label="Notifications"
              className="p-2 text-nordic hover:text-mosque transition-colors relative rounded-full hover:bg-mosque/5 cursor-pointer"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full"></span>
            </button>

            <button
              aria-label="User Profile"
              className="ml-2 flex items-center gap-2 p-1 rounded-full hover:bg-mosque/5 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-mosque/10 overflow-hidden border border-mosque/20">
                <img
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  src={currentUser.avatarUrl}
                />
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-nordic hover:text-mosque p-2 rounded-md hover:bg-mosque/5 cursor-pointer"
              aria-label="Toggle navigation menu"
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
          mobileMenuOpen ? "max-h-64 py-3" : "max-h-0 py-0"
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = !isDetailPage && activeTab === link.label;
            return (
              <button
                key={link.label}
                onClick={() => {
                  handleLinkClick(link.label, link.href);
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
        </div>
      </div>
    </nav>
  );
};
