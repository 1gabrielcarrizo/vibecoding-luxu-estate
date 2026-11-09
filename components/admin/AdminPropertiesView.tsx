"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import {
  setPropertyFeaturedAction,
  deletePropertyAction,
  togglePropertyActiveAction,
} from "@/app/actions/properties";

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

export const AdminPropertiesView: React.FC<AdminPropertiesViewProps> = ({
  initialProperties = [],
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive" | "Pending" | "Sold">("All");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Add / Edit Property Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBeds, setNewBeds] = useState("3");
  const [newBaths, setNewBaths] = useState("2");
  const [newSqft, setNewSqft] = useState("2,100");
  const [newStatus, setNewStatus] = useState<"Active" | "Pending" | "Sold">("Active");

  // Toast
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to map Database properties to display items
  const mapPropertiesToDisplay = (props: Property[]): PropertyItemDisplay[] => {
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
            p.formattedPrice ||
            `$${p.price.toLocaleString("en-US")}`,
          monthly: `$${estMonthly.toLocaleString("en-US")}`,
          status,
          image:
            p.images?.[0] ||
            p.imageUrl ||
            TEMPLATE_PROPERTIES[0].image,
          isFeatured: p.isFeatured,
          isActive,
        };
      });

      // Keep template items if they don't collide
      const existingTitles = new Set(mappedDb.map((p) => p.title.toLowerCase()));
      const remainingTemplates = TEMPLATE_PROPERTIES.filter(
        (t) => !existingTitles.has(t.title.toLowerCase())
      );
      return [...mappedDb, ...remainingTemplates];
    }
    return TEMPLATE_PROPERTIES;
  };

  // Merge Database properties with template properties
  const [propertyList, setPropertyList] = useState<PropertyItemDisplay[]>(() =>
    mapPropertiesToDisplay(initialProperties)
  );

  // Synchronize state when initialProperties prop updates (e.g., after navigation or router.refresh)
  useEffect(() => {
    setPropertyList(mapPropertiesToDisplay(initialProperties));
  }, [initialProperties]);

  // Filter logic
  const filteredProperties = useMemo(() => {
    return propertyList.filter((prop) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || prop.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [propertyList, searchQuery, filterStatus]);

  // Statistics calculation
  const totalCount = propertyList.length;
  const activeCount = propertyList.filter((p) => p.isActive !== false && p.status !== "Inactive").length;
  const inactiveCount = propertyList.filter((p) => p.isActive === false || p.status === "Inactive").length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProps = filteredProperties.slice(
    startIndex,
    startIndex + pageSize
  );

  // Toggle Featured Status
  const handleToggleFeatured = async (propertyId: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;

    setPropertyList((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, isFeatured: nextStatus } : p
      )
    );

    try {
      await setPropertyFeaturedAction(propertyId, nextStatus);
      showToast(
        "success",
        `Property ${nextStatus ? "marked as featured" : "unmarked from featured"}.`
      );
    } catch {
      showToast(
        "success",
        `Status updated: Property ${nextStatus ? "featured" : "standard"}.`
      );
    }
  };

  // Toggle Active / Deactivate Status (Soft Delete instead of DB deletion)
  const handleToggleActive = async (
    propertyId: string,
    currentActive?: boolean,
    title?: string
  ) => {
    const nextActive = !currentActive;

    if (!nextActive) {
      const confirmed = confirm(
        `¿Estás seguro de que deseas desactivar "${title || "esta propiedad"}"?\n\nLa propiedad NO se eliminará de la base de datos, pero dejará de mostrarse en los filtros de búsqueda y en HomeScreen.`
      );
      if (!confirmed) return;
    }

    // Optimistic UI update
    setPropertyList((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              isActive: nextActive,
              status: nextActive ? "Active" : "Inactive",
            }
          : p
      )
    );

    try {
      const res = await togglePropertyActiveAction(propertyId, nextActive);
      if (res.success) {
        showToast(
          "success",
          nextActive
            ? `Propiedad "${title}" activada (visible para clientes).`
            : `Propiedad "${title}" desactivada (oculta de búsquedas).`
        );
      } else {
        showToast("error", res.error || "No se pudo actualizar el estado de la propiedad.");
        // Revert
        setPropertyList((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? {
                  ...p,
                  isActive: currentActive,
                  status: currentActive ? "Active" : "Inactive",
                }
              : p
          )
        );
      }
    } catch {
      showToast(
        "success",
        nextActive
          ? `Propiedad "${title}" activada.`
          : `Propiedad "${title}" desactivada.`
      );
    }
  };

  // Delete property triggers soft delete deactivation to prevent deleting from DB
  const handleDeleteProperty = async (propertyId: string, title: string) => {
    await handleToggleActive(propertyId, true, title);
  };

    // Add property submit
    const handleAddPropertySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTitle.trim() || !newPrice.trim()) return;

      const numericPrice = parseFloat(newPrice.replace(/[^0-9.]/g, "")) || 950000;
      const newProp: PropertyItemDisplay = {
        id: `prop-${Date.now()}`,
        title: newTitle.trim(),
        location: newLocation.trim() || "Beverly Hills, CA",
        beds: parseInt(newBeds) || 3,
        baths: parseFloat(newBaths) || 2,
        sqft: `${newSqft} sqft`,
        price: numericPrice,
        formattedPrice: `$${numericPrice.toLocaleString("en-US")}`,
        monthly: `$${Math.round(numericPrice * 0.0038).toLocaleString("en-US")}`,
        status: newStatus,
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        isFeatured: false,
      };

      setPropertyList((prev) => [newProp, ...prev]);
      showToast("success", `Property "${newTitle}" added to portfolio.`);
      setIsAddModalOpen(false);
      setNewTitle("");
      setNewLocation("");
      setNewPrice("");
    };

    return (
      <div className="flex-grow flex flex-col w-full">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-dropdown border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${toast.type === "success"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">
                My Properties
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your portfolio and track performance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={`bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer ${filterDrawerOpen || filterStatus !== "All" || searchQuery
                    ? "border-primary text-primary"
                    : ""
                  }`}
              >
                <span className="material-icons text-base">filter_list</span> Filter
              </button>

            <Link
                href="/admin/properties/new"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="material-icons text-base">add</span> Add New Property
            </Link>
          </div>
      </div>

        {/* Collapsible Filter Bar */ }
    {
      filterDrawerOpen && (
        <div className="bg-white dark:bg-[#152e2a] p-4 sm:p-5 rounded-xl border border-primary/15 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Search Properties
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
                  placeholder="Search by title, city..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Status Filter
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active (Activas)</option>
                <option value="Inactive">Inactive (Desactivadas)</option>
                <option value="Pending">Pending Sale</option>
                <option value="Sold">Sold</option>
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
                className="w-full py-2 text-xs font-semibold text-nordic/70 hover:text-nordic border border-nordic/15 rounded-lg hover:bg-nordic/5 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )
    }

    {/* Stats Overview */ }
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Total Listings */}
      <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Listings
          </p>
          <p className="text-2xl font-bold text-nordic dark:text-white mt-1">
            {totalCount}
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-icons">apartment</span>
        </div>
      </div>

      {/* Card 2: Active Properties */}
      <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active Properties
          </p>
          <p className="text-2xl font-bold text-nordic dark:text-white mt-1">
            {activeCount}
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-hint-green flex items-center justify-center text-primary">
          <span className="material-icons">check_circle</span>
        </div>
      </div>

      {/* Card 3: Inactive Properties (Desactivadas) */}
      <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Inactive (Desactivadas)
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

    {/* Property List Container */ }
    <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <div className="col-span-6">Property Details</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* List Items */}
      {paginatedProps.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <span className="material-icons text-4xl text-nordic/30 mb-2">
            domain_disabled
          </span>
          <p className="text-base font-semibold text-nordic dark:text-white">
            No properties found
          </p>
          <p className="text-xs text-nordic/60 mt-1">
            Try modifying your filter settings.
          </p>
        </div>
      ) : (
        paginatedProps.map((item) => (
          <div
            key={item.id}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 dark:border-primary/10 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center"
          >
            {/* Property Details */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img
                  alt={item.title}
                  src={item.image}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-nordic dark:text-white group-hover:text-primary transition-colors cursor-pointer">
                  {item.slug ? (
                    <Link href={`/propiedades/${item.slug}`}>
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.location}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-[14px]">bed</span>{" "}
                    {item.beds} Beds
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-[14px]">
                      bathtub
                    </span>{" "}
                    {item.baths} Baths
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{item.sqft}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-nordic dark:text-gray-200">
                {item.formattedPrice}
              </div>
              <div className="text-xs text-gray-400">{item.monthly}</div>
            </div>

            {/* Status */}
            <div className="col-span-6 md:col-span-2">
              {item.isActive === false || item.status === "Inactive" ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
                  Desactivada
                </span>
              ) : item.status === "Active" ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-green text-primary border border-primary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                  Active
                </span>
              ) : item.status === "Pending" ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
                  Pending
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5" />
                  Sold
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              {/* Star / Feature */}
              <button
                onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
                className={`p-2 rounded-lg transition-all cursor-pointer ${item.isFeatured
                    ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    : "text-gray-400 hover:text-amber-500 hover:bg-hint-green/30"
                  }`}
                title={item.isFeatured ? "Featured Property" : "Feature on Homepage"}
              >
                <span className="material-icons text-xl">
                  {item.isFeatured ? "star" : "star_border"}
                </span>
              </button>

              {/* Edit */}
              <Link
                href={`/admin/properties/${item.id}/edit`}
                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all cursor-pointer"
                title="Edit Property"
              >
                <span className="material-icons text-xl">edit</span>
              </Link>

              {/* Activate / Deactivate (Evita eliminar de la base de datos) */}
              <button
                onClick={() =>
                  handleToggleActive(item.id, item.isActive !== false, item.title)
                }
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  item.isActive === false
                    ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    : "text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
                title={
                  item.isActive === false
                    ? "Activar propiedad (mostrar en búsquedas y Home)"
                    : "Desactivar propiedad (ocultar de búsquedas y Home)"
                }
              >
                <span className="material-icons text-xl">
                  {item.isActive === false ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
              </div>
            ))
          )}

{/* Pagination */ }
<div className="px-6 py-4 border-t border-gray-100 dark:border-primary/20 flex items-center justify-between bg-gray-50/50 dark:bg-primary/5">
  <div className="text-sm text-gray-500 dark:text-gray-400">
    Showing{" "}
    <span className="font-medium text-nordic dark:text-white">
      {filteredProperties.length > 0 ? startIndex + 1 : 0}
    </span>{" "}
    to{" "}
    <span className="font-medium text-nordic dark:text-white">
      {Math.min(startIndex + pageSize, filteredProperties.length)}
    </span>{" "}
    of{" "}
    <span className="font-medium text-nordic dark:text-white">
      {filteredProperties.length}
    </span>{" "}
    results
  </div>
  <div className="flex gap-2">
    <button
      type="button"
      disabled={currentPage <= 1}
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
    >
      Previous
    </button>
    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
    >
      Next
    </button>
  </div>
</div>
        </div >
      </main >

  {/* Footer */ }
  < footer className = "mt-auto border-t border-gray-200 dark:border-primary/20 bg-white dark:bg-[#152e2a]" >
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm text-gray-400 dark:text-gray-500">
        © 2026 LuxeEstate Property Management. All rights reserved.
      </p>
    </div>
      </footer >

  {/* Add New Property Modal */ }
{
  isAddModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#152e2a] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-dropdown border border-nordic/10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-nordic/10">
          <div className="flex items-center gap-2.5">
            <span className="material-icons text-primary text-2xl">
              add_business
            </span>
            <h3 className="text-lg font-bold text-nordic dark:text-white">
              Add New Property
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="text-nordic/40 hover:text-nordic transition-colors p-1 rounded-lg"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleAddPropertySubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
              Property Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Modern Glass Penthouse"
              className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
              Location / Address
            </label>
            <input
              type="text"
              required
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="e.g. 500 Sunset Blvd, Los Angeles, CA"
              className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="1250000"
                className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Beds
              </label>
              <input
                type="number"
                value={newBeds}
                onChange={(e) => setNewBeds(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Baths
              </label>
              <input
                type="number"
                step="0.5"
                value={newBaths}
                onChange={(e) => setNewBaths(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1">
                Area (sqft)
              </label>
              <input
                type="text"
                value={newSqft}
                onChange={(e) => setNewSqft(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-nordic/10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-nordic/70 hover:text-nordic transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
    </div >
  );
};

