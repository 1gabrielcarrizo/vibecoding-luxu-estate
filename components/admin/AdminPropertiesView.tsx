"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import {
  setPropertyFeaturedAction,
  togglePropertyActiveAction,
} from "@/app/actions/properties";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";
import { useRealtimeTableSync } from "@/lib/supabase/useRealtimeSync";

interface AdminPropertiesViewProps {
  initialProperties?: Property[];
}

interface PropertyItemDisplay {
  id: string;
  slug?: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  price: number;
  formattedPrice: string;
  monthly: string;
  status: "Active" | "Pending" | "Sold" | "Inactive";
  image: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

const TEMPLATE_PROPERTIES: PropertyItemDisplay[] = [
  {
    id: "prop-1",
    slug: "the-nordic-villa",
    title: "The Nordic Villa",
    location: "12 Willow Creek Ln, Copenhagen",
    beds: 4,
    baths: 3,
    sqft: "2,450 sqft",
    price: 1250000,
    formattedPrice: "$1,250,000",
    monthly: "$4,500",
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAk2ZSdNOQ0gAXqtE2fb8NByvZ3XDhK1eHyPrIVVzkKRxP--gmwVUs_dFtYH7ySMZBDJ9dUfLhxw1HqhJRxo0T5qrmKZz1GjWXADnSf4hEPvVDRm0aKTl3gRRF5M9S5wRufLo8fKI5Py_un_8jurvEW2rsKLVZXiOt9hZvHtaEHizJmZZC2ncBfdpPfu9UtyE_aFK_1NSxqRUcAyEWvWqLel7QMCA0_DAS7ch6BAEubDCw3iSjElZ-uF5TUlSkdQudUUhJJJ83mUuI",
    isFeatured: true,
  },
  {
    id: "prop-2",
    slug: "sunset-apartments",
    title: "Sunset Apartments",
    location: "88 Ocean Blvd, Miami",
    beds: 2,
    baths: 2,
    sqft: "1,100 sqft",
    price: 850000,
    formattedPrice: "$850,000",
    monthly: "$3,200",
    status: "Pending",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjnJzYkn2uSsE2x2CSp6ta_eTDBXO0CZv61SwICEoMCfPe-cXvPfWieOb9hv9CnQctjbT43Fs4LcDrGOwXm4RhUAmZwiePudeFf6wid2-OWTpcQ1jl4SMOfOe_jSsjtjahG_azMWzAEvQ0Lsznu5nzMuAHgSN7A0vJzviwycaZsVzyYS4tVIpC1QprgwkIuolRTTXvY-OhBEuMuxtXQ4MJJH3k3FpWJX07kPgNzSqclGY5HvlrSlEEBoFvh_8Q9-JZTCFF8ipOWU",
    isFeatured: false,
  },
  {
    id: "prop-3",
    slug: "forest-retreat",
    title: "Forest Retreat",
    location: "45 Pine Ridge, Portland",
    beds: 3,
    baths: 2,
    sqft: "1,800 sqft",
    price: 920000,
    formattedPrice: "$920,000",
    monthly: "$3,800",
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBO_XzpFopH9b8yABT1a6LlIMtEJKX00xuhg2A0IeMjK9sALNffKjbe7t7f8gCqV5ZzBgmyXTq7pB9bqc3UWVnFMPevsVV4XVmVmYGeMx73HL0uaixP254RZfPJ-zWwsJ4WdYzi1mxC0BpDIzW-hZwVm37WY1SePsrzRCGzDdssQ8fuDXGat1chiFJTtJAnWQqGHIaApgBNfDlwItdrqc7Rz4nsaxgLOVGgJbBXzoxtcLKLkVWuf9KfnT_xwMYaD0ps9cLRzZtlRh0",
    isFeatured: true,
  },
  {
    id: "prop-4",
    slug: "the-family-estate",
    title: "The Family Estate",
    location: "102 Maple Dr, Austin",
    beds: 5,
    baths: 4,
    sqft: "3,200 sqft",
    price: 1450000,
    formattedPrice: "$1,450,000",
    monthly: "Sold: Oct 12, 2023",
    status: "Sold",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAm5jrJp_zdGyEfKQhZOpfX0eYAr_nK7lYpqgTo6B3X0V84hnvkBRKtd1NKfyzbZXptrnatucZKXEUdB_g4pmYytqZB_6-vGvs8VifQGG9fRqVL_Lr6350F_fSVeZh0hqULKewnVdwnGc8thCF8ARhaHzH9EtDknKo21GxwPEYTOXaaHEeGSVTSMSma2diZicSwy3jelgSoYNdpIQoMAgcmM2OlWB--DvX-WR-AYQ6rtTFbnnBwM1_2FW1r4bTYvX1Xw5KFp1GySqI",
    isFeatured: false,
  },
  {
    id: "prop-5",
    slug: "skyline-penthouse",
    title: "Skyline Penthouse",
    location: "440 W 57th St, New York",
    beds: 3,
    baths: 3.5,
    sqft: "2,800 sqft",
    price: 4500000,
    formattedPrice: "$4,500,000",
    monthly: "$15,000",
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3Kx0QAdUmL9txkYX2nBiMhiFrJIW59QWMclky71MuBfbl_DzIipQvGFMh8fxLAVvFg8otdIJr9lt4W4RkWo5lQlQFhqc_BCTDITjg-y2PGAZ8mewi_ipn_U_wASsLBvwXfK1akutnYmO_yIN23qhIHGZnkxxh7y7sfwD90EloN5uILLeA5NUVHbczcFicGewNod99A1k_IOfesqSTya9-dj5KifLlwcnuWggNHe4Gn2DREAc_6FcD6N_CpGybDw32EMk0AiRcWGY",
    isFeatured: true,
  },
];

function mapPropertiesToDisplay(props: Property[]): PropertyItemDisplay[] {
  if (props.length > 0) {
    const mappedDb: PropertyItemDisplay[] = props.map((p) => {
      const estMonthly = Math.round(p.price * 0.004);
      const isActive = p.isActive !== false;
      const status: "Active" | "Pending" | "Sold" | "Inactive" = !isActive
        ? "Inactive"
        : p.badge?.toUpperCase().includes("SOLD")
          ? "Sold"
          : "Active";

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        location: p.location,
        beds: p.beds,
        baths: p.baths,
        sqft: `${p.sqm || 2000} m²`,
        price: p.price,
        formattedPrice:
          p.formattedPrice || `$${p.price.toLocaleString("en-US")}`,
        monthly: `$${estMonthly.toLocaleString("en-US")}`,
        status,
        image: p.images?.[0] || p.imageUrl || TEMPLATE_PROPERTIES[0].image,
        isFeatured: p.isFeatured,
        isActive,
      };
    });

    const existingTitles = new Set(mappedDb.map((p) => p.title.toLowerCase()));
    const remainingTemplates = TEMPLATE_PROPERTIES.filter(
      (t) => !existingTitles.has(t.title.toLowerCase())
    );
    return [...mappedDb, ...remainingTemplates];
  }
  return TEMPLATE_PROPERTIES;
}

export const AdminPropertiesView: React.FC<AdminPropertiesViewProps> = ({
  initialProperties = [],
}) => {
  const router = useRouter();
  const { t, locale } = useTranslation();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive" | "Pending" | "Sold"
  >("All");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Toast
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const [overrides, setOverrides] = useState<
    Record<string, Partial<PropertyItemDisplay>>
  >({});

  // Real-time synchronization across admin sessions when any property changes
  const handleRealtimePropertyChange = useCallback(
    (payload: { new?: Record<string, unknown>; old?: Record<string, unknown> }) => {
      const changedId =
        (typeof payload.new?.id === "string" && payload.new.id) ||
        (typeof payload.old?.id === "string" && payload.old.id) ||
        null;

      if (changedId) {
        setOverrides((prev) => {
          if (!(changedId in prev)) return prev;
          const next = { ...prev };
          delete next[changedId];
          return next;
        });
      }
      router.refresh();
    },
    [router]
  );

  useRealtimeTableSync({
    table: "properties",
    debounceMs: 350,
    onEvent: handleRealtimePropertyChange,
  });

  const propertyList = useMemo(() => {
    const base = mapPropertiesToDisplay(initialProperties);
    return base.map((item) =>
      overrides[item.id] ? { ...item, ...overrides[item.id] } : item
    );
  }, [initialProperties, overrides]);

  // Filter logic
  const filteredProperties = useMemo(() => {
    return propertyList.filter((prop) => {
      const displayTitle = prop.slug
        ? getLocalizedTitle(prop.slug, locale, prop.title)
        : prop.title;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        prop.title.toLowerCase().includes(q) ||
        displayTitle.toLowerCase().includes(q) ||
        prop.location.toLowerCase().includes(q);

      const matchesStatus =
        filterStatus === "All" || prop.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [propertyList, searchQuery, filterStatus, locale]);

  // Statistics calculation
  const totalCount = propertyList.length;
  const activeCount = propertyList.filter(
    (p) => p.isActive !== false && p.status !== "Inactive"
  ).length;
  const inactiveCount = propertyList.filter(
    (p) => p.isActive === false || p.status === "Inactive"
  ).length;

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / pageSize)
  );
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProps = filteredProperties.slice(
    startIndex,
    startIndex + pageSize
  );

  // Toggle Featured Status
  const handleToggleFeatured = async (
    propertyId: string,
    currentStatus?: boolean
  ) => {
    const nextStatus = !currentStatus;

    setOverrides((prev) => ({
      ...prev,
      [propertyId]: { ...prev[propertyId], isFeatured: nextStatus },
    }));

    try {
      await setPropertyFeaturedAction(propertyId, nextStatus);
      showToast(
        "success",
        nextStatus
          ? t("admin.properties.toastFeatured")
          : t("admin.properties.toastUnfeatured")
      );
    } catch {
      showToast(
        "success",
        nextStatus
          ? t("admin.properties.toastFeatured")
          : t("admin.properties.toastUnfeatured")
      );
    }
  };

  // Toggle Active / Deactivate Status
  const handleToggleActive = async (
    propertyId: string,
    currentActive?: boolean,
    title?: string
  ) => {
    const nextActive = !currentActive;
    const safeTitle = title || "";

    setOverrides((prev) => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        isActive: nextActive,
        status: nextActive ? "Active" : "Inactive",
      },
    }));

    try {
      const res = await togglePropertyActiveAction(propertyId, nextActive);
      if (res.success) {
        showToast(
          "success",
          nextActive
            ? t("admin.properties.toastActivated", { title: safeTitle })
            : t("admin.properties.toastDeactivated", { title: safeTitle })
        );
      } else {
        showToast("error", res.error || t("admin.properties.toastStatusError"));
        setOverrides((prev) => ({
          ...prev,
          [propertyId]: {
            ...prev[propertyId],
            isActive: currentActive,
            status: currentActive ? "Active" : "Inactive",
          },
        }));
      }
    } catch {
      showToast(
        "success",
        nextActive
          ? t("admin.properties.toastActivated", { title: safeTitle })
          : t("admin.properties.toastDeactivated", { title: safeTitle })
      );
    }
  };

  return (
    <div className="flex-grow flex flex-col w-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-dropdown border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-white text-emerald-800 border-emerald-200 dark:bg-[#152e2a] dark:text-emerald-300 dark:border-emerald-800"
              : "bg-white text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800"
          }`}
        >
          <span className="material-icons text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-nordic dark:text-white tracking-tight">
              {t("admin.properties.title")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
              {t("admin.properties.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`flex-1 sm:flex-initial bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                filterDrawerOpen || filterStatus !== "All" || searchQuery
                  ? "border-primary text-primary"
                  : ""
              }`}
            >
              <span className="material-icons text-base">filter_list</span>
              <span>{t("admin.properties.filter")}</span>
            </button>

            <Link
              href="/admin/properties/new"
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
            >
              <span className="material-icons text-base">add</span>
              <span>{t("admin.properties.addProperty")}</span>
            </Link>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {filterDrawerOpen && (
          <div className="bg-white dark:bg-[#152e2a] p-4 sm:p-5 rounded-xl border border-primary/15 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                  {t("admin.properties.searchLabel")}
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-2.5 text-nordic/40 text-lg">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={t("admin.properties.searchPlaceholder")}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                  {t("admin.properties.statusFilterLabel")}
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(
                      e.target.value as
                        | "All"
                        | "Active"
                        | "Inactive"
                        | "Pending"
                        | "Sold"
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="All">
                    {t("admin.properties.allStatuses")}
                  </option>
                  <option value="Active">
                    {t("admin.properties.statusActive")}
                  </option>
                  <option value="Inactive">
                    {t("admin.properties.statusInactive")}
                  </option>
                  <option value="Pending">
                    {t("admin.properties.statusPending")}
                  </option>
                  <option value="Sold">
                    {t("admin.properties.statusSold")}
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("All");
                    setCurrentPage(1);
                  }}
                  className="w-full py-2 text-xs font-semibold text-nordic/70 hover:text-nordic border border-nordic/15 rounded-lg hover:bg-nordic/5 transition-colors cursor-pointer"
                >
                  {t("admin.properties.resetFilters")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("admin.properties.totalListings")}
              </p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">
                {totalCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-icons">apartment</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("admin.properties.activeProperties")}
              </p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">
                {activeCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-hint-green flex items-center justify-center text-primary">
              <span className="material-icons">check_circle</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("admin.properties.inactiveProperties")}
              </p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">
                {inactiveCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <span className="material-icons">visibility_off</span>
            </div>
          </div>
        </div>

        {/* Property List Container */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">{t("admin.properties.colDetails")}</div>
            <div className="col-span-2">{t("admin.properties.colPrice")}</div>
            <div className="col-span-2">{t("admin.properties.colStatus")}</div>
            <div className="col-span-2 text-right">
              {t("admin.properties.colActions")}
            </div>
          </div>

          {/* List Items */}
          {paginatedProps.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <span className="material-icons text-4xl text-nordic/30 mb-2">
                domain_disabled
              </span>
              <p className="text-base font-semibold text-nordic dark:text-white">
                {t("admin.properties.noProperties")}
              </p>
              <p className="text-xs text-nordic/60 mt-1">
                {t("admin.properties.noPropertiesSub")}
              </p>
            </div>
          ) : (
            paginatedProps.map((item) => {
              const displayTitle = item.slug
                ? getLocalizedTitle(item.slug, locale, item.title)
                : item.title;

              return (
                <div
                  key={item.id}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-primary/10 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center"
                >
                  {/* Property Details */}
                  <div className="col-span-12 md:col-span-6 flex gap-3 sm:gap-4 items-center">
                    <div className="relative h-16 w-20 sm:h-20 sm:w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        alt={displayTitle}
                        src={item.image}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-nordic dark:text-white group-hover:text-primary transition-colors cursor-pointer truncate">
                        {item.slug ? (
                          <Link href={`/propiedades/${item.slug}`}>
                            {displayTitle}
                          </Link>
                        ) : (
                          displayTitle
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.location}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-[14px]">
                            bed
                          </span>{" "}
                          {item.beds} {t("admin.properties.beds")}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-[14px]">
                            bathtub
                          </span>{" "}
                          {item.baths} {t("admin.properties.baths")}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{item.sqft}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-6 md:col-span-2">
                    <div className="text-sm sm:text-base font-semibold text-nordic dark:text-gray-200">
                      {item.formattedPrice}
                    </div>
                    <div className="text-xs text-gray-400">{item.monthly}</div>
                  </div>

                  {/* Status */}
                  <div className="col-span-6 md:col-span-2 flex justify-end md:justify-start">
                    {item.isActive === false || item.status === "Inactive" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
                        {t("admin.properties.statusInactive")}
                      </span>
                    ) : item.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-green text-primary border border-primary/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                        {t("admin.properties.statusActive")}
                      </span>
                    ) : item.status === "Pending" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
                        {t("admin.properties.statusPending")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5" />
                        {t("admin.properties.statusSold")}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-1.5 sm:gap-2 pt-2 md:pt-0 border-t md:border-0 border-gray-100 dark:border-primary/10">
                    {/* Star / Feature */}
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleFeatured(item.id, item.isFeatured)
                      }
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        item.isFeatured
                          ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                          : "text-gray-400 hover:text-amber-500 hover:bg-hint-green/30"
                      }`}
                      title={
                        item.isFeatured
                          ? t("admin.properties.featuredTitle")
                          : t("admin.properties.featureOnHome")
                      }
                      aria-label={
                        item.isFeatured
                          ? t("admin.properties.featuredTitle")
                          : t("admin.properties.featureOnHome")
                      }
                    >
                      <span className="material-icons text-xl leading-none select-none flex items-center justify-center">
                        {item.isFeatured ? "star" : "star_border"}
                      </span>
                    </button>

                    {/* Edit */}
                    <Link
                      href={`/admin/properties/${item.id}/edit`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all cursor-pointer"
                      title={t("admin.properties.editTitle")}
                      aria-label={t("admin.properties.editTitle")}
                    >
                      <span className="material-icons text-xl leading-none select-none flex items-center justify-center">
                        edit
                      </span>
                    </Link>

                    {/* Activate / Deactivate */}
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleActive(
                          item.id,
                          item.isActive !== false,
                          displayTitle
                        )
                      }
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        item.isActive === false
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          : "text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      }`}
                      title={
                        item.isActive === false
                          ? t("admin.properties.activateTitle")
                          : t("admin.properties.deactivateTitle")
                      }
                      aria-label={
                        item.isActive === false
                          ? t("admin.properties.activateTitle")
                          : t("admin.properties.deactivateTitle")
                      }
                    >
                      <span className="material-icons text-xl leading-none select-none flex items-center justify-center">
                        {item.isActive === false
                          ? "visibility"
                          : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-primary/5">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
              {t("admin.properties.showing")}{" "}
              <span className="font-medium text-nordic dark:text-white">
                {filteredProperties.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              {t("admin.properties.to")}{" "}
              <span className="font-medium text-nordic dark:text-white">
                {Math.min(startIndex + pageSize, filteredProperties.length)}
              </span>{" "}
              {t("admin.properties.of")}{" "}
              <span className="font-medium text-nordic dark:text-white">
                {filteredProperties.length}
              </span>{" "}
              {t("admin.properties.results")}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs sm:text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {t("admin.properties.previous")}
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1.5 text-xs sm:text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {t("admin.properties.next")}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-primary/20 bg-white dark:bg-[#152e2a]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            {t("admin.properties.footerRights")}
          </p>
        </div>
      </footer>
    </div>
  );
};
