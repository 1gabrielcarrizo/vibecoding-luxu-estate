"use client";

import React, { useState, useMemo, useSyncExternalStore, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Property } from "@/types/property";
import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { useAuth } from "@/lib/supabase/AuthContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useVisits, ScheduledVisit } from "@/lib/visits/VisitsContext";
import { useNotifications } from "@/lib/notifications/NotificationsContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";
import { useRealtimeTableSync } from "@/lib/supabase/useRealtimeSync";

type ProfileTab = "saved" | "visits" | "settings";

interface ProfilePrefs {
  customName: string;
  location: string;
  newPropertyAlerts: boolean;
  priceDropAlerts: boolean;
  tourReminders: boolean;
}

const DEFAULT_PREFS: ProfilePrefs = {
  customName: "",
  location: "San Francisco, CA",
  newPropertyAlerts: true,
  priceDropAlerts: true,
  tourReminders: true,
};

const PREFS_EVENT = "luxe-estate-profile-prefs-change";

function getPrefsKey(userId?: string | null): string {
  return userId
    ? `luxe_estate_profile_prefs_${userId}`
    : "luxe_estate_profile_prefs";
}

function readPrefsRaw(key: string): string {
  if (typeof window === "undefined") return "{}";
  try {
    return window.localStorage.getItem(key) || "{}";
  } catch {
    return "{}";
  }
}

function parsePrefs(raw: string): ProfilePrefs {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PREFS;
    return {
      customName:
        typeof parsed.customName === "string"
          ? parsed.customName
          : DEFAULT_PREFS.customName,
      location:
        typeof parsed.location === "string" && parsed.location.trim()
          ? parsed.location
          : DEFAULT_PREFS.location,
      newPropertyAlerts:
        typeof parsed.newPropertyAlerts === "boolean"
          ? parsed.newPropertyAlerts
          : DEFAULT_PREFS.newPropertyAlerts,
      priceDropAlerts:
        typeof parsed.priceDropAlerts === "boolean"
          ? parsed.priceDropAlerts
          : DEFAULT_PREFS.priceDropAlerts,
      tourReminders:
        typeof parsed.tourReminders === "boolean"
          ? parsed.tourReminders
          : DEFAULT_PREFS.tourReminders,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(key: string, next: ProfilePrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(PREFS_EVENT, { detail: { key } }));
  } catch {
    // ignore storage errors
  }
}

interface UserProfileScreenProps {
  allProperties: Property[];
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  allProperties,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();
  const { user, avatarUrl, displayName, email, isLoading: isAuthLoading, signOut } =
    useAuth();
  const {
    favorites,
    isHydrated: isFavHydrated,
    removeFavorite,
  } = useFavorites();
  const {
    visits,
    visitsCount,
    isHydrated: isVisitsHydrated,
    removeVisit,
  } = useVisits();
  const { addNotification } = useNotifications();

  const handleRealtimeRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useRealtimeTableSync({
    table: "properties",
    debounceMs: 400,
    onEvent: handleRealtimeRefresh,
  });

  const tabFromUrl = searchParams.get("tab");
  const urlTab: ProfileTab =
    tabFromUrl === "visits" || tabFromUrl === "settings" ? tabFromUrl : "saved";

  const [tabOverride, setTabOverride] = useState<{
    forUrl: string | null;
    tab: ProfileTab;
  } | null>(null);
  const activeTab: ProfileTab =
    tabOverride && tabOverride.forUrl === tabFromUrl ? tabOverride.tab : urlTab;
  const setActiveTab = (tab: ProfileTab) => {
    setTabOverride({ forUrl: tabFromUrl, tab });
  };
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const editFormRef = useRef<HTMLFormElement>(null);

  const prefsKey = useMemo(() => getPrefsKey(user?.id ?? null), [user?.id]);

  const subscribePrefs = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const onStorage = (e: StorageEvent) => {
        if (!e.key || e.key === prefsKey) onChange();
      };
      const onCustom = (e: Event) => {
        const key = (e as CustomEvent<{ key?: string }>).detail?.key;
        if (!key || key === prefsKey) onChange();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(PREFS_EVENT, onCustom);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(PREFS_EVENT, onCustom);
      };
    },
    [prefsKey]
  );

  const rawPrefs = useSyncExternalStore(
    subscribePrefs,
    () => readPrefsRaw(prefsKey),
    () => "{}"
  );

  const prefs = useMemo(() => parsePrefs(rawPrefs), [rawPrefs]);

  const updatePrefs = useCallback(
    (patch: Partial<ProfilePrefs>) => {
      const next = { ...prefs, ...patch };
      savePrefs(prefsKey, next);
    },
    [prefs, prefsKey]
  );

  // Resolve full Property objects for user's saved favorites
  const savedProperties = useMemo(() => {
    const map = new Map<string, Property>();
    for (const p of allProperties) map.set(p.id, p);

    const list: Property[] = [];
    for (const fav of favorites) {
      const prop = map.get(fav.id);
      if (prop) list.push(prop);
    }
    return list;
  }, [allProperties, favorites]);

  const profileDisplayName =
    prefs.customName.trim() || displayName || t("profile.guestName");

  const memberYear = (() => {
    if (user?.created_at) {
      const parsed = new Date(user.created_at);
      if (!Number.isNaN(parsed.getFullYear())) {
        return parsed.getFullYear();
      }
    }
    return 2026;
  })();

  const localeTag =
    locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US";

  const formatVisitDate = (dateIso: string, timeSlot: string) => {
    const [y, m, d] = dateIso.split("-").map(Number);
    if (!y || !m || !d) return `${dateIso}, ${timeSlot}`;
    const date = new Date(y, m - 1, d);
    const shortDate = new Intl.DateTimeFormat(localeTag, {
      month: "short",
      day: "numeric",
    }).format(date);
    return `${shortDate}, ${timeSlot}`;
  };

  const getDirectionsUrl = (visit: ScheduledVisit) => {
    if (visit.lat != null && visit.lng != null) {
      return `https://www.google.com/maps/search/?api=1&query=${visit.lat},${visit.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${visit.propertyTitle} ${visit.propertyLocation}`
    )}`;
  };

  const openEditProfile = () => {
    setEditName(profileDisplayName);
    setEditLocation(prefs.location);
    setIsEditingProfile(true);
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleCancelVisit = (visit: ScheduledVisit) => {
    removeVisit(visit.id);
    const localizedTitle = getLocalizedTitle(
      visit.propertySlug,
      locale,
      visit.propertyTitle
    );
    addNotification({
      type: "visit_cancelled",
      title: t("notifications.visitCancelledTitle"),
      message: t("notifications.visitCancelledMessage", {
        title: localizedTitle,
      }),
      href: `/propiedades/${visit.propertySlug}`,
    });
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrefs({
      customName: editName.trim(),
      location: editLocation.trim() || DEFAULT_PREFS.location,
    });
    setIsEditingProfile(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const bedsLabel = (n: number) =>
    n === 1 ? t("favorites.bedSingular") : t("favorites.bedsPlural");
  const bathsLabel = (n: number) =>
    n === 1 ? t("favorites.bathSingular") : t("favorites.bathsPlural");

  return (
    <div className="bg-clear-day font-display text-nordic min-h-screen flex flex-col selection:bg-mosque selection:text-white">
      <Navbar isDetailPage={true} />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-8 lg:py-12 xl:py-16 max-w-7xl mx-auto w-full">
        {/* Guest Sign-In Hint Banner */}
        {!isAuthLoading && !user && (
          <div className="mb-6 bg-white/90 border border-mosque/15 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-hint-green text-mosque flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-lg">person_outline</span>
              </div>
              <p className="text-sm text-nordic/80">
                {t("profile.guestBannerText")}
              </p>
            </div>
            <Link
              href="/login?next=/profile"
              className="px-4 py-2 rounded-lg bg-mosque hover:bg-nordic text-white text-sm font-medium transition-colors text-center whitespace-nowrap"
            >
              {t("nav.signIn")}
            </Link>
          </div>
        )}

        {/* Profile Hero Header — faithful to user_profile_screen/code.html */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 lg:mb-16 bg-hint-green p-6 sm:p-8 rounded-3xl shadow-sm border border-nordic/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative group flex-shrink-0">
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    alt={profileDisplayName}
                    src={avatarUrl}
                    fill
                    sizes="(max-width: 1024px) 96px, 128px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl lg:text-4xl font-bold text-mosque">
                    {profileDisplayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={openEditProfile}
                aria-label={t("profile.editProfile")}
                title={t("profile.editProfile")}
                className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-mosque text-white rounded-full flex items-center justify-center hover:bg-nordic transition-colors shadow-md cursor-pointer"
              >
                <span className="material-icons text-sm lg:text-base">
                  edit
                </span>
              </button>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-nordic mb-2">
                {profileDisplayName}
              </h1>
              <p className="text-nordic/70 font-light flex items-center flex-wrap gap-y-1 text-sm sm:text-base">
                <span className="inline-flex items-center gap-1.5">
                  <span className="material-icons text-sm">location_on</span>
                  <span>{prefs.location}</span>
                </span>
                <span className="mx-2.5">•</span>
                <span>
                  {t("profile.memberSince", { year: memberYear })}
                </span>
              </p>
            </div>
          </div>

          {/* Stats Box */}
          <div className="flex gap-6 lg:gap-12 bg-white px-6 sm:px-8 py-4 rounded-xl shadow-sm border border-nordic/5 w-full md:w-auto justify-around md:justify-start">
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className="text-center cursor-pointer group"
            >
              <div className="text-2xl font-bold text-nordic group-hover:text-mosque transition-colors">
                {isFavHydrated ? savedProperties.length : "—"}
              </div>
              <div className="text-xs uppercase tracking-wider text-nordic/50 font-medium">
                {t("profile.statsSaved")}
              </div>
            </button>
            <div className="w-px bg-nordic/10" />
            <button
              type="button"
              onClick={() => setActiveTab("visits")}
              className="text-center cursor-pointer group"
            >
              <div className="text-2xl font-bold text-mosque">
                {isVisitsHydrated ? visitsCount : "—"}
              </div>
              <div className="text-xs uppercase tracking-wider text-nordic/50 font-medium">
                {t("profile.statsVisits")}
              </div>
            </button>
            <div className="w-px bg-nordic/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-nordic">0</div>
              <div className="text-xs uppercase tracking-wider text-nordic/50 font-medium">
                {t("profile.statsSold")}
              </div>
            </div>
          </div>
        </header>

        {/* Inline Edit Profile Drawer */}
        {isEditingProfile && (
          <form
            ref={editFormRef}
            onSubmit={handleSaveProfileEdit}
            className="mb-10 bg-white rounded-2xl p-6 border border-mosque/15 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label
                htmlFor="profile-edit-name"
                className="block text-xs font-bold text-nordic/50 uppercase tracking-wider mb-1.5"
              >
                {t("profile.displayNameLabel")}
              </label>
              <input
                id="profile-edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-clear-day border border-nordic/15 text-sm text-nordic focus:outline-none focus:border-mosque"
              />
            </div>
            <div>
              <label
                htmlFor="profile-edit-location"
                className="block text-xs font-bold text-nordic/50 uppercase tracking-wider mb-1.5"
              >
                {t("profile.locationLabel")}
              </label>
              <input
                id="profile-edit-location"
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-clear-day border border-nordic/15 text-sm text-nordic focus:outline-none focus:border-mosque"
              />
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2.5 rounded-lg border border-nordic/10 text-nordic/70 hover:text-nordic text-sm font-medium cursor-pointer"
              >
                {t("scheduleVisit.cancel")}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {t("profile.saveChanges")}
              </button>
            </div>
          </form>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-nordic/10 mb-10 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`pb-4 px-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "saved"
                ? "text-nordic font-semibold border-mosque"
                : "text-nordic/50 hover:text-nordic font-medium border-transparent hover:border-nordic/20"
            }`}
          >
            {t("profile.tabSaved")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("visits")}
            className={`pb-4 px-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "visits"
                ? "text-nordic font-semibold border-mosque"
                : "text-nordic/50 hover:text-nordic font-medium border-transparent hover:border-nordic/20"
            }`}
          >
            {t("profile.tabVisits")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`pb-4 px-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "settings"
                ? "text-nordic font-semibold border-mosque"
                : "text-nordic/50 hover:text-nordic font-medium border-transparent hover:border-nordic/20"
            }`}
          >
            {t("profile.tabSettings")}
          </button>
        </div>

        {/* SAVED PROPERTIES GRID (Shown on "saved" tab) */}
        {activeTab === "saved" && (
          <section>
            {!isFavHydrated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm border border-nordic/5"
                  >
                    <div className="h-64 bg-slate-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-slate-200 w-2/3 rounded" />
                      <div className="h-4 bg-slate-200 w-1/2 rounded" />
                      <div className="h-4 bg-slate-200 w-full rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-nordic/5 p-10 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-hint-green text-mosque mx-auto mb-4 flex items-center justify-center">
                  <span className="material-icons text-2xl">
                    favorite_border
                  </span>
                </div>
                <h3 className="text-xl font-bold text-nordic mb-2">
                  {t("favorites.emptyTitle")}
                </h3>
                <p className="text-nordic/60 text-sm max-w-md mx-auto mb-6">
                  {t("favorites.emptyDescription")}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white text-sm font-medium transition-colors shadow-sm"
                >
                  <span>{t("favorites.browseListings")}</span>
                  <span className="material-icons text-base">
                    arrow_forward
                  </span>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedProperties.slice(0, 6).map((property, index) => {
                    const displayTitle = getLocalizedTitle(
                      property.slug,
                      locale,
                      property.title
                    );
                    const primaryImage =
                      (property.images && property.images.length > 0
                        ? property.images[0]
                        : property.imageUrl) ||
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

                    return (
                      <article
                        key={property.id}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-nordic/5"
                      >
                        <div className="relative h-64 overflow-hidden bg-slate-100">
                          <Link
                            href={`/propiedades/${property.slug}`}
                            className="block w-full h-full relative"
                          >
                            <Image
                              alt={property.imageAlt || displayTitle}
                              src={primaryImage}
                              fill
                              priority={index === 0}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </Link>

                          <div className="absolute top-4 right-4 z-10">
                            <button
                              type="button"
                              onClick={() => removeFavorite(property.id)}
                              aria-label={t("favorites.removeAria")}
                              title={t("favorites.removeAria")}
                              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-mosque shadow-sm hover:bg-white transition-colors cursor-pointer"
                            >
                              <span className="material-icons">favorite</span>
                            </button>
                          </div>

                          <div className="absolute bottom-4 left-4 bg-nordic/90 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-medium pointer-events-none">
                            {property.formattedPrice}
                            {property.type === "rent"
                              ? t("propertyDetail.perMonth")
                              : ""}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Link
                              href={`/propiedades/${property.slug}`}
                              className="min-w-0 group/title"
                            >
                              <h3 className="text-xl font-bold text-nordic mb-1 truncate group-hover/title:text-mosque transition-colors">
                                {displayTitle}
                              </h3>
                              <p className="text-nordic/60 text-sm truncate">
                                {property.location}
                              </p>
                            </Link>
                          </div>

                          <div className="flex items-center gap-4 text-nordic/70 text-sm border-t border-nordic/10 pt-4 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons text-base">
                                bed
                              </span>{" "}
                              {property.beds} {bedsLabel(property.beds)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons text-base">
                                bathtub
                              </span>{" "}
                              {property.baths} {bathsLabel(property.baths)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons text-base">
                                square_foot
                              </span>{" "}
                              {property.sqm.toLocaleString("en-US")}{" "}
                              {t("propertyCard.sqm")}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {savedProperties.length > 6 && (
                  <div className="mt-8 text-center">
                    <Link
                      href="/favorites"
                      className="inline-flex items-center gap-2 text-mosque font-semibold text-sm hover:underline"
                    >
                      <span>
                        {t("profile.viewAllSaved", {
                          count: savedProperties.length,
                        })}
                      </span>
                      <span className="material-icons text-base">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* UPCOMING VISITS SECTION (Shown on "saved" overview and dedicated "visits" tab) */}
        {(activeTab === "saved" || activeTab === "visits") && (
          <section className={activeTab === "saved" ? "mt-16" : ""}>
            <h2 className="text-2xl font-bold text-nordic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-mosque rounded-full" />
              {t("profile.upcomingVisits")}
            </h2>

            {!isVisitsHydrated ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse flex flex-col md:flex-row bg-white p-2 rounded-xl border border-nordic/5 items-center shadow-sm"
                  >
                    <div className="w-full md:w-48 h-32 md:h-24 rounded-lg bg-slate-200 shrink-0" />
                    <div className="flex-1 p-4 space-y-2 w-full">
                      <div className="h-4 bg-slate-200 w-36 rounded" />
                      <div className="h-5 bg-slate-200 w-56 rounded" />
                      <div className="h-4 bg-slate-200 w-40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visits.length === 0 ? (
              <div className="bg-white rounded-2xl border border-nordic/5 p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-clear-day text-mosque mx-auto mb-3 flex items-center justify-center">
                  <span className="material-icons text-2xl">event</span>
                </div>
                <h3 className="text-lg font-bold text-nordic mb-1.5">
                  {t("profile.noVisitsTitle")}
                </h3>
                <p className="text-nordic/60 text-sm max-w-md mx-auto mb-5">
                  {t("profile.noVisitsSub")}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white text-sm font-medium transition-colors"
                >
                  <span>{t("favorites.browseListings")}</span>
                  <span className="material-icons text-base">
                    arrow_forward
                  </span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => {
                  const localizedTitle = getLocalizedTitle(
                    visit.propertySlug,
                    locale,
                    visit.propertyTitle
                  );

                  return (
                    <div
                      key={visit.id}
                      className="flex flex-col md:flex-row bg-white p-2 rounded-xl border border-nordic/5 items-center hover:shadow-md transition-all shadow-sm"
                    >
                      <Link
                        href={`/propiedades/${visit.propertySlug}`}
                        className="w-full md:w-48 h-36 md:h-24 rounded-lg overflow-hidden shrink-0 relative block bg-slate-100"
                      >
                        <Image
                          alt={localizedTitle}
                          src={visit.propertyImage}
                          fill
                          sizes="(max-width: 768px) 100vw, 192px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-nordic/10" />
                      </Link>

                      <div className="flex-1 p-4 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-mosque font-semibold text-sm mb-1 uppercase tracking-wide">
                            <span className="material-icons text-base">
                              calendar_today
                            </span>
                            <span>
                              {formatVisitDate(visit.dateIso, visit.timeSlot)}
                            </span>
                          </div>
                          <Link
                            href={`/propiedades/${visit.propertySlug}`}
                            className="hover:text-mosque transition-colors"
                          >
                            <h4 className="text-lg font-bold text-nordic truncate">
                              {localizedTitle}
                            </h4>
                          </Link>
                          <p className="text-nordic/60 text-sm flex items-center gap-1 mt-1">
                            <span className="material-icons text-sm">
                              person
                            </span>
                            <span>
                              {t("profile.agentPrefix")} {visit.agentName}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Link
                            href={`/propiedades/${visit.propertySlug}/schedule`}
                            className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-nordic/10 text-nordic hover:bg-nordic/5 transition-colors text-sm font-medium text-center whitespace-nowrap"
                          >
                            {t("profile.reschedule")}
                          </Link>
                          <a
                            href={getDirectionsUrl(visit)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-5 py-2.5 rounded-lg bg-mosque text-white hover:bg-nordic transition-colors text-sm font-medium shadow-sm shadow-mosque/30 text-center whitespace-nowrap"
                          >
                            {t("profile.getDirections")}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCancelVisit(visit)}
                            aria-label={t("profile.cancelVisitAria")}
                            title={t("profile.cancelVisitAria")}
                            className="p-2 text-nordic/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                          >
                            <span className="material-icons text-lg block">
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ACCOUNT PREFERENCES SECTION (Shown on "saved" overview and expanded on "settings" tab) */}
        {(activeTab === "saved" || activeTab === "settings") && (
          <section
            className={`${
              activeTab === "saved" ? "mt-16" : ""
            } bg-white rounded-2xl p-6 sm:p-8 border border-nordic/5 shadow-sm`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-nordic">
                  {t("profile.accountPreferences")}
                </h2>
                <p className="text-nordic/50 text-sm mt-1">
                  {t("profile.accountPreferencesSub")}
                </p>
              </div>
              {activeTab === "saved" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="text-mosque font-medium text-sm hover:underline cursor-pointer self-start md:self-auto"
                >
                  {t("profile.viewAllSettings")}
                </button>
              ) : (
                user && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium text-sm cursor-pointer self-start md:self-auto"
                  >
                    <span className="material-icons text-base">logout</span>
                    <span>{t("nav.signOut")}</span>
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-nordic/40 uppercase tracking-wider mb-2">
                  {t("profile.emailAddress")}
                </label>
                <div className="flex items-center gap-3 p-3 bg-clear-day rounded-lg border border-nordic/10">
                  <span className="material-icons text-nordic/40">mail</span>
                  <input
                    className="bg-transparent border-none outline-none flex-1 text-nordic text-sm focus:ring-0 w-full"
                    readOnly
                    type="email"
                    value={email || t("profile.noEmailSignedOut")}
                  />
                  {user ? (
                    <button
                      type="button"
                      onClick={openEditProfile}
                      className="text-xs text-mosque font-medium hover:underline cursor-pointer"
                    >
                      {t("profile.change")}
                    </button>
                  ) : (
                    <Link
                      href="/login?next=/profile"
                      className="text-xs text-mosque font-medium hover:underline whitespace-nowrap"
                    >
                      {t("nav.signIn")}
                    </Link>
                  )}
                </div>
              </div>

              {/* Notifications: New Property Alerts */}
              <div>
                <label className="block text-xs font-bold text-nordic/40 uppercase tracking-wider mb-2">
                  {t("profile.notifications")}
                </label>
                <div className="flex items-center justify-between p-3 bg-clear-day rounded-lg border border-nordic/10 h-[50px]">
                  <span className="text-sm text-nordic">
                    {t("profile.newPropertyAlerts")}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={prefs.newPropertyAlerts}
                      onChange={(e) =>
                        updatePrefs({ newPropertyAlerts: e.target.checked })
                      }
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mosque" />
                  </label>
                </div>
              </div>

              {/* Extra Settings shown when user opens full Preferences & Settings tab */}
              {activeTab === "settings" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-nordic/40 uppercase tracking-wider mb-2">
                      {t("profile.priceAlertsLabel")}
                    </label>
                    <div className="flex items-center justify-between p-3 bg-clear-day rounded-lg border border-nordic/10 h-[50px]">
                      <span className="text-sm text-nordic">
                        {t("profile.priceDropAlerts")}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={prefs.priceDropAlerts}
                          onChange={(e) =>
                            updatePrefs({ priceDropAlerts: e.target.checked })
                          }
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mosque" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-nordic/40 uppercase tracking-wider mb-2">
                      {t("profile.visitRemindersLabel")}
                    </label>
                    <div className="flex items-center justify-between p-3 bg-clear-day rounded-lg border border-nordic/10 h-[50px]">
                      <span className="text-sm text-nordic">
                        {t("profile.tourReminders")}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={prefs.tourReminders}
                          onChange={(e) =>
                            updatePrefs({ tourReminders: e.target.checked })
                          }
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mosque" />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>

      {savedNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-40 bg-nordic text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm border border-white/10"
        >
          <span className="material-icons text-hint-green text-base">
            check_circle
          </span>
          <span>{t("profile.profileUpdated")}</span>
        </div>
      )}

      <PropertyFooter />
    </div>
  );
};
