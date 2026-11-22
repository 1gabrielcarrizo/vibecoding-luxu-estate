"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useNotifications,
  NotificationType,
  AppNotification,
} from "@/lib/notifications/NotificationsContext";
import { useVisits } from "@/lib/visits/VisitsContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface NotificationsDropdownProps {
  variant?: "public" | "admin";
}

function getNotificationIcon(type: NotificationType): {
  icon: string;
  colorClass: string;
} {
  switch (type) {
    case "visit_scheduled":
      return {
        icon: "event_available",
        colorClass: "bg-hint-green text-mosque",
      };
    case "visit_cancelled":
      return {
        icon: "event_busy",
        colorClass: "bg-rose-50 text-rose-600",
      };
    case "agent_message":
      return {
        icon: "mark_email_read",
        colorClass: "bg-mosque/10 text-mosque",
      };
    case "sell_request":
      return {
        icon: "real_estate_agent",
        colorClass: "bg-hint-green text-nordic",
      };
    default:
      return {
        icon: "notifications",
        colorClass: "bg-mosque/10 text-mosque",
      };
  }
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  variant = "public",
}) => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const {
    notifications,
    unreadCount,
    isHydrated,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  } = useNotifications();
  const { visits, visitsCount } = useVisits();
  const { favoritesCount } = useFavorites();

  const [isOpen, setIsOpen] = useState(false);
  const [nowTs, setNowTs] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setNowTs(Date.now());
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const formatRelativeTime = (timestamp: number): string => {
    const diffMs = Math.max(0, nowTs - timestamp);
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return t("notifications.justNow");
    if (diffMin < 60) return t("notifications.minutesAgo", { count: diffMin });
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return t("notifications.hoursAgo", { count: diffHours });
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return t("notifications.daysAgo", { count: diffDays });
    const localeTag =
      locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US";
    return new Intl.DateTimeFormat(localeTag, {
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  const handleNotificationClick = (item: AppNotification) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.href) {
      router.push(item.href);
    }
  };

  const nextVisit = visits[0] || null;
  const hasBadge = isHydrated && unreadCount > 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t("nav.notificationsAria")}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t("nav.notificationsAria")}
        className={
          variant === "admin"
            ? "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-nordic/60 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative cursor-pointer"
            : "w-9 h-9 sm:w-10 sm:h-10 text-nordic hover:text-mosque transition-colors relative rounded-full hover:bg-mosque/5 flex items-center justify-center cursor-pointer flex-shrink-0"
        }
      >
        <span
          className={`material-symbols-outlined leading-none select-none flex items-center justify-center ${
            variant === "admin" ? "text-xl" : "text-xl sm:text-2xl"
          }`}
        >
          notifications
        </span>
        {hasBadge && (
          <span
            aria-label={`${unreadCount} ${t("notifications.unread")}`}
            className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-mosque text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-clear-day"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label={t("notifications.title")}
          className={`fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 ${
            variant === "admin" ? "top-16" : "top-20"
          } sm:top-full sm:mt-2 sm:w-96 rounded-2xl bg-white dark:bg-[#152e2a] shadow-2xl border border-mosque/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-mosque/10 flex items-center justify-between bg-clear-day/50 dark:bg-[#1a3833]/60">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-nordic dark:text-white">
                {t("notifications.title")}
              </h3>
              {hasBadge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-hint-green text-mosque">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-mosque hover:text-nordic dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t("notifications.markAllRead")}
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="text-xs font-medium text-nordic/50 hover:text-rose-600 transition-colors cursor-pointer"
                  title={t("notifications.clearAll")}
                >
                  {t("notifications.clearAll")}
                </button>
              )}
            </div>
          </div>

          {/* Upcoming Visit Reminder Banner (connected to VisitsContext) */}
          {nextVisit && (
            <Link
              href="/profile?tab=visits"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 bg-hint-green/40 hover:bg-hint-green/60 border-b border-mosque/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-mosque text-white flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-base">calendar_today</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-mosque">
                  {visitsCount === 1
                    ? t("notifications.upcomingVisitSingle")
                    : t("notifications.upcomingVisitMultiple", {
                        count: visitsCount,
                      })}
                </p>
                <p className="text-xs font-semibold text-nordic truncate">
                  {nextVisit.propertyTitle}
                </p>
                <p className="text-[11px] text-nordic/70 truncate">
                  {nextVisit.dateIso} • {nextVisit.timeSlot}
                </p>
              </div>
              <span className="material-icons text-mosque text-base flex-shrink-0">
                chevron_right
              </span>
            </Link>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-mosque/5">
            {notifications.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-clear-day text-mosque/70 mx-auto mb-3 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">
                    notifications_none
                  </span>
                </div>
                <p className="text-sm font-semibold text-nordic dark:text-white">
                  {t("notifications.emptyTitle")}
                </p>
                <p className="text-xs text-nordic/60 dark:text-gray-400 mt-1 leading-relaxed">
                  {t("notifications.emptyDescription")}
                </p>
                {favoritesCount > 0 && (
                  <Link
                    href="/favorites"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-mosque hover:underline"
                  >
                    <span className="material-icons text-sm">favorite</span>
                    <span>
                      {t("notifications.viewSavedHomes", {
                        count: favoritesCount,
                      })}
                    </span>
                  </Link>
                )}
              </div>
            ) : (
              notifications.map((item) => {
                const { icon, colorClass } = getNotificationIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className={`group flex items-start gap-3 px-4 py-3 transition-colors ${
                      item.read
                        ? "bg-white dark:bg-[#152e2a] hover:bg-clear-day/40"
                        : "bg-mosque/[0.04] hover:bg-mosque/[0.08]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className="flex items-start gap-3 flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}
                      >
                        <span className="material-icons text-base">{icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-nordic dark:text-white truncate">
                            {item.title}
                          </p>
                          {!item.read && (
                            <span className="w-2 h-2 rounded-full bg-mosque flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-nordic/70 dark:text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-nordic/45 dark:text-gray-400 mt-1 block">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeNotification(item.id)}
                      aria-label={t("notifications.dismissAria")}
                      title={t("notifications.dismissAria")}
                      className="p-1 text-nordic/35 hover:text-nordic dark:hover:text-white rounded-full hover:bg-nordic/5 transition-colors cursor-pointer flex-shrink-0 opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <span className="material-icons text-sm block">close</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-mosque/10 bg-clear-day/30 dark:bg-[#1a3833]/40 flex items-center justify-between gap-2">
            {variant === "admin" ? (
              <>
                <Link
                  href="/admin/properties"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-mosque hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    apartment
                  </span>
                  <span>{t("notifications.manageProperties")}</span>
                </Link>
                <Link
                  href="/profile?tab=settings"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium text-nordic/60 hover:text-mosque transition-colors"
                >
                  {t("notifications.configureAlerts")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile?tab=visits"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium text-nordic/70 hover:text-mosque transition-colors flex items-center gap-1"
                >
                  <span className="material-icons text-sm">event</span>
                  <span>{t("profile.tabVisits")}</span>
                </Link>
                <Link
                  href="/profile?tab=settings"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-mosque hover:underline flex items-center gap-1"
                >
                  <span className="material-icons text-sm">tune</span>
                  <span>{t("notifications.configureAlerts")}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
