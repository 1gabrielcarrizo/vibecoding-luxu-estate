"use client";

import React, { useState, useRef, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import { PropertyInput } from "@/lib/supabase/properties";
import { createPropertyAction, updatePropertyAction } from "@/app/actions/properties";
import { supabase } from "@/lib/supabase/client";

// Dynamically import Leaflet map to avoid window SSR issues
const DynamicReactLeafletMap = dynamic(
  () => import("@/components/property/ReactLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-56 bg-slate-100 animate-pulse flex flex-col items-center justify-center gap-2">
        <span className="material-icons text-mosque/40 text-2xl animate-spin">
          sync
        </span>
        <span className="text-xs text-gray-400 font-sf-pro">
          Loading map...
        </span>
      </div>
    ),
  }
);

interface PropertyFormProps {
  initialData?: Property | null;
  isEdit?: boolean;
}

const AVAILABLE_AMENITIES = [
  "Swimming Pool",
  "Garden",
  "Air Conditioning",
  "Smart Home",
  "Balcony",
  "Gym",
  "Security",
  "Ocean View",
  "Spa",
  "Fireplace",
  "Elevator",
  "Wine Cellar",
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Basic Information
  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState<string>(
    initialData ? initialData.price.toString() : ""
  );
  const [status, setStatus] = useState<"for-sale" | "for-rent" | "sold">(() => {
    if (initialData?.badge?.toUpperCase().includes("SOLD")) return "sold";
    if (initialData?.type === "rent") return "for-rent";
    return "for-sale";
  });
  const [category, setCategory] = useState<
    "House" | "Apartment" | "Villa" | "Penthouse" | "Commercial"
  >((initialData?.category as any) || "House");
  const [priceSuffix, setPriceSuffix] = useState(
    initialData?.priceSuffix || ""
  );

  // Description
  const [description, setDescription] = useState(
    initialData?.description
      ? Array.isArray(initialData.description)
        ? initialData.description.join("\n\n")
        : (initialData.description as string)
      : ""
  );

  // Gallery
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Location
  const [location, setLocation] = useState(
    initialData?.location || ""
  );
  const [lat, setLat] = useState<string>(() => {
    if (initialData?.coordinates?.lat != null) {
      return initialData.coordinates.lat.toString();
    }
    return "";
  });
  const [lng, setLng] = useState<string>(() => {
    if (initialData?.coordinates?.lng != null) {
      return initialData.coordinates.lng.toString();
    }
    return "";
  });

  const parsedLatNum = parseFloat(lat);
  const parsedLngNum = parseFloat(lng);
  const hasValidCoords =
    lat.trim() !== "" &&
    lng.trim() !== "" &&
    !isNaN(parsedLatNum) &&
    !isNaN(parsedLngNum) &&
    parsedLatNum >= -90 &&
    parsedLatNum <= 90 &&
    parsedLngNum >= -180 &&
    parsedLngNum <= 180;

  // Details
  const [sqm, setSqm] = useState<string>(
    initialData?.sqm ? initialData.sqm.toString() : "250"
  );
  const [yearBuilt, setYearBuilt] = useState<string>(
    initialData?.yearBuilt ? initialData.yearBuilt.toString() : "2023"
  );
  const [beds, setBeds] = useState<number>(initialData?.beds ?? 3);
  const [baths, setBaths] = useState<number>(initialData?.baths ?? 2);
  const [garage, setGarage] = useState<number>(initialData?.garage ?? 1);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
    if (initialData?.amenities && initialData.amenities.length > 0) {
      return initialData.amenities;
    }
    return ["Swimming Pool", "Garden", "Air Conditioning"];
  });

  // Additional settings
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialData?.isFeatured ?? false
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialData?.isActive !== undefined ? initialData.isActive : true
  );
  const [badge, setBadge] = useState<string>(
    initialData?.badge || ""
  );

  // Field validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    price?: string;
    location?: string;
    sqm?: string;
    yearBuilt?: string;
    images?: string;
  }>({});

  // Toast & Feedback
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle amenity
  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Formatting description toolbar
  const insertTextAtCursor = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(
      "description"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = description.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;

    const newDesc =
      description.substring(0, start) +
      replacement +
      description.substring(end);
    setDescription(newDesc);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + replacement.length - suffix.length
      );
    }, 10);
  };

  // Core file upload handler (handles both file input and drag-and-drop)
  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate max file size 5MB
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the 5MB size limit.`);
        continue;
      }

      // Validate image mime type
      if (!file.type.startsWith("image/")) {
        setUploadError(`File "${file.name}" is not a supported image file.`);
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const filePath = `listings/${Date.now()}_${sanitizedName}.${fileExt}`;

      try {
        const { error: uploadErr } = await supabase.storage
          .from("properties")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadErr) {
          console.error("Storage upload error:", uploadErr);
          setUploadError(`Upload error for ${file.name}: ${uploadErr.message}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      } catch (err: any) {
        console.error("Unexpected upload error:", err);
        setUploadError(err?.message || "Failed to upload image.");
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls]);
      setErrors((prev) => ({ ...prev, images: "" }));
      showToast(
        "success",
        `${uploadedUrls.length} image${
          uploadedUrls.length > 1 ? "s" : ""
        } uploaded to Supabase Storage!`
      );
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  // Set Main Image
  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    showToast("success", "Set as main cover image.");
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add custom URL image
  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setErrors((prev) => ({ ...prev, images: "" }));
    setCustomImageUrl("");
    showToast("success", "Image URL added to gallery.");
  };

  // Comprehensive Form Validation
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Property Title is required.";
    } else if (title.trim().length < 4) {
      newErrors.title = "Property Title must be at least 4 characters.";
    }

    const cleanPrice = price.toString().replace(/[^0-9.]/g, "");
    const numericPrice = parseFloat(cleanPrice);
    if (!price || cleanPrice === "") {
      newErrors.price = "Price is required.";
    } else if (isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Price must be greater than 0 (no negative or zero values).";
    }

    if (!location.trim()) {
      newErrors.location = "Property address / location is required.";
    }

    const numSqm = parseFloat(sqm);
    if (!sqm || isNaN(numSqm) || numSqm <= 0) {
      newErrors.sqm = "Area must be greater than 0 m².";
    }

    const numYear = parseInt(yearBuilt);
    const currentYear = new Date().getFullYear();
    if (
      yearBuilt &&
      (isNaN(numYear) || numYear < 1800 || numYear > currentYear + 5)
    ) {
      newErrors.yearBuilt = `Enter a valid year between 1800 and ${currentYear + 5}.`;
    }

    if (images.length === 0) {
      newErrors.images =
        "At least one property image is required. Upload or enter an image URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Please fix the marked fields before submitting.");
      return;
    }

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    const typeValue: "sale" | "rent" = status === "for-rent" ? "rent" : "sale";
    const computedBadge =
      badge.trim() ||
      (status === "sold"
        ? "SOLD"
        : status === "for-rent"
        ? "FOR RENT"
        : isFeatured
        ? "FEATURED"
        : "FOR SALE");

    const parsedLat = lat.trim() !== "" ? parseFloat(lat) : undefined;
    const parsedLng = lng.trim() !== "" ? parseFloat(lng) : undefined;
    const hasCoordinates =
      parsedLat !== undefined &&
      parsedLng !== undefined &&
      !isNaN(parsedLat) &&
      !isNaN(parsedLng);

    const payload: PropertyInput = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice,
      type: typeValue,
      category,
      priceSuffix:
        priceSuffix.trim() || (typeValue === "rent" ? "/month" : undefined),
      beds,
      baths,
      sqm: parseFloat(sqm) || 200,
      garage,
      yearBuilt: parseInt(yearBuilt) || new Date().getFullYear(),
      images: images,
      description: description.trim(),
      amenities: selectedAmenities,
      isFeatured,
      isActive,
      badge: computedBadge,
      lat: hasCoordinates ? parsedLat : undefined,
      lng: hasCoordinates ? parsedLng : undefined,
      coordinates: hasCoordinates
        ? { lat: parsedLat!, lng: parsedLng! }
        : undefined,
    };

    startTransition(async () => {
      try {
        if (isEdit && initialData?.id) {
          const res = await updatePropertyAction(initialData.id, payload);
          if (res.success) {
            showToast("success", `Property "${payload.title}" updated successfully!`);
            router.refresh();
            setTimeout(() => {
              window.location.href = "/admin/properties";
            }, 600);
          } else {
            showToast("error", res.error || "Failed to update property.");
          }
        } else {
          const res = await createPropertyAction(payload);
          if (res.success) {
            showToast("success", `Property "${payload.title}" published successfully!`);
            router.refresh();
            setTimeout(() => {
              window.location.href = "/admin/properties";
            }, 600);
          } else {
            showToast("error", res.error || "Failed to create property.");
          }
        }
      } catch (err: any) {
        showToast("error", err?.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="bg-clear-day text-nordic min-h-screen selection:bg-hint-green selection:text-nordic">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-dropdown border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-white text-emerald-800 border-emerald-200 shadow-lg"
              : "bg-white text-rose-800 border-rose-200 shadow-lg"
          }`}
        >
          <span className="material-icons text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Sticky Action Bar & Header */}
      <div className="sticky top-16 z-40 bg-clear-day/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2 text-xs text-gray-500 font-medium font-sf-pro">
                <li>
                  <Link
                    className="hover:text-mosque transition-colors"
                    href="/admin/properties"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <span className="material-icons text-xs text-gray-400">
                    chevron_right
                  </span>
                </li>
                <li aria-current="page" className="text-nordic font-semibold">
                  {isEdit ? "Edit Property" : "Add New"}
                </li>
              </ol>
            </nav>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-nordic tracking-tight">
                {isEdit ? "Edit Property" : "Add New Property"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal font-sf-pro hidden sm:block">
                {isEdit
                  ? "Update listing specifications, pricing, amenities, coordinates, and gallery."
                  : "Fill in the details below to create a new listing. Fields marked with * are mandatory."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/properties")}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending || isUploading}
              onClick={handleSubmit}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm cursor-pointer disabled:opacity-50"
            >
              <span className="material-icons text-sm">
                {isPending ? "hourglass_empty" : "save"}
              </span>
              {isPending
                ? "Saving..."
                : isEdit
                ? "Update Property"
                : "Save Property"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main 12-Column Grid Form matching code.html */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column (8 cols) */}
          <div className="xl:col-span-8 space-y-8">
            {/* Card 1: Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">info</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">
                  Basic Information
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="group">
                  <label
                    className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                    htmlFor="title"
                  >
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full text-base px-4 py-2.5 rounded-md border bg-white text-nordic placeholder-gray-400 transition-all font-sf-pro ${
                      errors.title
                        ? "border-rose-500 ring-1 ring-rose-500 focus:border-rose-500"
                        : "border-gray-200 focus:ring-1 focus:ring-mosque focus:border-mosque"
                    }`}
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    placeholder="e.g. Modern Penthouse with Ocean View"
                    type="text"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-rose-600 font-medium font-sf-pro">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                      htmlFor="price"
                    >
                      Price (USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">
                        $
                      </span>
                      <input
                        className={`w-full pl-7 pr-4 py-2.5 rounded-md border bg-white text-nordic placeholder-gray-400 transition-all text-base font-medium font-sf-pro ${
                          errors.price
                            ? "border-rose-500 ring-1 ring-rose-500 focus:border-rose-500"
                            : "border-gray-200 focus:ring-1 focus:ring-mosque focus:border-mosque"
                        }`}
                        id="price"
                        value={price}
                        min="0.01"
                        step="any"
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setPrice("");
                            setErrors((prev) => ({
                              ...prev,
                              price: "Price is required.",
                            }));
                            return;
                          }
                          const num = parseFloat(val);
                          if (num < 0) return;
                          setPrice(val);
                          if (num <= 0) {
                            setErrors((prev) => ({
                              ...prev,
                              price:
                                "Price must be greater than 0 (no negative or zero values).",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, price: "" }));
                          }
                        }}
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-xs text-rose-600 font-medium font-sf-pro">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                      id="status"
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value as "for-sale" | "for-rent" | "sold"
                        )
                      }
                    >
                      <option value="for-sale">For Sale</option>
                      <option value="for-rent">For Rent</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                      htmlFor="category"
                    >
                      Property Type
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                      id="category"
                      value={category}
                      onChange={(e) =>
                        setCategory(
                          e.target.value as
                            | "House"
                            | "Apartment"
                            | "Villa"
                            | "Penthouse"
                            | "Commercial"
                        )
                      }
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                {/* Additional Price Suffix field (especially for Rent) */}
                {status === "for-rent" && (
                  <div>
                    <label
                      className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                      htmlFor="priceSuffix"
                    >
                      Price Suffix (e.g. /month, /week)
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro"
                      id="priceSuffix"
                      value={priceSuffix}
                      onChange={(e) => setPriceSuffix(e.target.value)}
                      placeholder="/month"
                      type="text"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">description</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">Description</h2>
              </div>
              <div className="p-8">
                <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
                  <button
                    className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    type="button"
                    title="Bold"
                    onClick={() => insertTextAtCursor("**", "**")}
                  >
                    <span className="material-icons text-lg">format_bold</span>
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    type="button"
                    title="Italic"
                    onClick={() => insertTextAtCursor("*", "*")}
                  >
                    <span className="material-icons text-lg">
                      format_italic
                    </span>
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    type="button"
                    title="Bullet List"
                    onClick={() => insertTextAtCursor("\n- ")}
                  >
                    <span className="material-icons text-lg">
                      format_list_bulleted
                    </span>
                  </button>
                </div>
                <textarea
                  className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property features, neighborhood, and unique selling points..."
                  maxLength={2000}
                />
                <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
                  {description.length} / 2000 characters
                </div>
              </div>
            </div>

            {/* Card 3: Gallery (Supabase Bucket Integration with Drag and Drop) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                    <span className="material-icons text-lg">image</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-nordic">Gallery</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Supabase Storage Bucket:{" "}
                      <span className="font-semibold text-mosque">properties</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">
                  JPG, PNG, WEBP
                </span>
              </div>
              <div className="p-8">
                {/* Upload Dropzone with Drag and Drop functionality */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group ${
                    isDragging
                      ? "border-mosque bg-hint-green/30 ring-4 ring-mosque/20 scale-[1.01]"
                      : errors.images
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-gray-300 bg-gray-50/50 hover:bg-hint-green/10 hover:border-mosque/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        uploadFiles(e.target.files);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                    <div
                      className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque transition-transform duration-300 ${
                        isDragging ? "scale-125 text-primary" : "group-hover:scale-110"
                      }`}
                    >
                      {isUploading ? (
                        <span className="material-icons text-2xl animate-spin">
                          sync
                        </span>
                      ) : (
                        <span className="material-icons text-2xl">
                          cloud_upload
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-nordic font-sf-pro">
                        {isUploading
                          ? "Uploading to Supabase..."
                          : isDragging
                          ? "Drop images right here!"
                          : "Click or drag images here to upload"}
                      </p>
                      <p className="text-xs text-gray-400 font-sf-pro">
                        Max file size 5MB per image. Directly saved in Supabase bucket.
                      </p>
                    </div>
                  </div>
                </div>

                {errors.images && (
                  <p className="mt-2 text-xs text-rose-600 font-medium font-sf-pro">
                    {errors.images}
                  </p>
                )}

                {uploadError && (
                  <p className="mt-2 text-xs text-rose-600 font-medium font-sf-pro">
                    {uploadError}
                  </p>
                )}

                {/* Direct URL input alternative */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste external image URL..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-nordic transition-colors cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Thumbnails Grid matching code.html */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {images.map((imgUrl, index) => (
                      <div
                        key={`${imgUrl}-${index}`}
                        className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-100 border border-gray-200"
                      >
                        <img
                          alt={`Listing photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          src={imgUrl}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                            type="button"
                            title="Delete image"
                          >
                            <span className="material-icons text-sm">
                              delete
                            </span>
                          </button>
                          {index !== 0 && (
                            <button
                              onClick={() => handleSetMainImage(index)}
                              className="w-8 h-8 rounded-full bg-white text-nordic hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                              type="button"
                              title="Set as Main Cover"
                            >
                              <span className="material-icons text-sm">
                                star
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Main Badge for index 0 */}
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">
                            Main
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Add More Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-green/20 transition-all group cursor-pointer"
                      type="button"
                    >
                      <span className="material-icons group-hover:scale-110 transition-transform">
                        add
                      </span>
                      <span className="text-xs mt-1 font-medium font-sf-pro">
                        Add More
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="xl:col-span-4 space-y-8">
            {/* Card 4: Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">place</span>
                </div>
                <h2 className="text-lg font-bold text-nordic">Location</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                    htmlFor="location"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-2.5 rounded-md border bg-white text-nordic placeholder-gray-400 transition-all text-sm font-sf-pro ${
                      errors.location
                        ? "border-rose-500 ring-1 ring-rose-500 focus:border-rose-500"
                        : "border-gray-200 focus:ring-1 focus:ring-mosque focus:border-mosque"
                    }`}
                    id="location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location)
                        setErrors((prev) => ({ ...prev, location: "" }));
                    }}
                    placeholder="Street Address, City, Zip"
                    type="text"
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-rose-600 font-medium font-sf-pro">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Latitude & Longitude inputs between Address and Map */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-xs font-medium text-nordic mb-1 font-sf-pro"
                      htmlFor="lat"
                    >
                      Latitude
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-xs font-sf-pro"
                      id="lat"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="e.g. 37.7749"
                      type="number"
                      step="any"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium text-nordic mb-1 font-sf-pro"
                      htmlFor="lng"
                    >
                      Longitude
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-xs font-sf-pro"
                      id="lng"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="e.g. -122.4194"
                      type="number"
                      step="any"
                    />
                  </div>
                </div>

                {/* Map preview or interactive Leaflet map */}
                <div className="relative z-0 [isolation:isolate] h-56 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {hasValidCoords ? (
                    <div className="relative w-full h-full">
                      <DynamicReactLeafletMap
                        key={`${parsedLatNum}-${parsedLngNum}`}
                        coordinates={{ lat: parsedLatNum, lng: parsedLngNum }}
                        title={title.trim() || "Property Location"}
                        location={location.trim() || `${parsedLatNum}, ${parsedLngNum}`}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full group">
                      <img
                        alt="Map preview placeholder"
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-all duration-300"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwIsl8beO34JRZ9dMmjLoIkTuTUO72Y9L5tUmQqTReQWebUWadAWwLusGmRQiIict5sqY--yRaOxuYpTzfR4vv4RKh1ex6oxY64e0kbSeMudNO6pv-gG0WzVWs-pDfvQm5IoTQ1mT-tAV49LDkXAHZl317M1-D7eZw3N8o2ExKWTgg6oMAXOFVnkApIqnb7TZHekwSw8pWQxpJV2EKI8EQKQbQXJaSbjN8gB1n8b-ueWj8"
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <span className="bg-white/95 text-nordic px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm text-xs font-medium font-sf-pro flex items-center gap-1.5 border border-gray-100 text-center">
                          <span className="material-icons text-sm text-mosque">
                            add_location_alt
                          </span>
                          Ingresa latitud y longitud para ver el mapa
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 5: Details (sticky top-40) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-40">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">straighten</span>
                </div>
                <h2 className="text-lg font-bold text-nordic">Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label
                      className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block"
                      htmlFor="area"
                    >
                      Area (m²) <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full text-left px-3 py-2 rounded border bg-gray-50 text-nordic transition-all font-sf-pro text-sm ${
                        errors.sqm
                          ? "border-rose-500 ring-1 ring-rose-500 focus:border-rose-500"
                          : "border-gray-200 focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque"
                      }`}
                      id="area"
                      value={sqm}
                      onChange={(e) => {
                        setSqm(e.target.value);
                        if (errors.sqm)
                          setErrors((prev) => ({ ...prev, sqm: "" }));
                      }}
                      placeholder="0"
                      type="number"
                    />
                    {errors.sqm && (
                      <p className="mt-1 text-xs text-rose-600 font-medium font-sf-pro">
                        {errors.sqm}
                      </p>
                    )}
                  </div>
                  <div className="group">
                    <label
                      className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block"
                      htmlFor="year"
                    >
                      Year Built
                    </label>
                    <input
                      className={`w-full text-left px-3 py-2 rounded border bg-gray-50 text-nordic transition-all font-sf-pro text-sm ${
                        errors.yearBuilt
                          ? "border-rose-500 ring-1 ring-rose-500 focus:border-rose-500"
                          : "border-gray-200 focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque"
                      }`}
                      id="year"
                      value={yearBuilt}
                      onChange={(e) => {
                        setYearBuilt(e.target.value);
                        if (errors.yearBuilt)
                          setErrors((prev) => ({ ...prev, yearBuilt: "" }));
                      }}
                      placeholder="YYYY"
                      type="number"
                    />
                    {errors.yearBuilt && (
                      <p className="mt-1 text-xs text-rose-600 font-medium font-sf-pro">
                        {errors.yearBuilt}
                      </p>
                    )}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Counters matching code.html */}
                <div className="space-y-4">
                  {/* Bedrooms */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">
                        bed
                      </span>{" "}
                      Bedrooms
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setBeds((b) => Math.max(0, b - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100 cursor-pointer"
                        type="button"
                      >
                        -
                      </button>
                      <input
                        className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro"
                        readOnly
                        type="text"
                        value={beds}
                      />
                      <button
                        onClick={() => setBeds((b) => b + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100 cursor-pointer"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">
                        shower
                      </span>{" "}
                      Bathrooms
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setBaths((b) => Math.max(0, b - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100 cursor-pointer"
                        type="button"
                      >
                        -
                      </button>
                      <input
                        className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro"
                        readOnly
                        type="text"
                        value={baths}
                      />
                      <button
                        onClick={() => setBaths((b) => b + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100 cursor-pointer"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Parking */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">
                        directions_car
                      </span>{" "}
                      Parking
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setGarage((g) => Math.max(0, g - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100 cursor-pointer"
                        type="button"
                      >
                        -
                      </button>
                      <input
                        className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro"
                        readOnly
                        type="text"
                        value={garage}
                      />
                      <button
                        onClick={() => setGarage((g) => g + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100 cursor-pointer"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Amenities Checkboxes matching code.html */}
                <div>
                  <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AVAILABLE_AMENITIES.map((item) => {
                      const isChecked = selectedAmenities.includes(item);
                      return (
                        <label
                          key={item}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAmenity(item)}
                            className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque cursor-pointer accent-[#006655]"
                          />
                          <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Additional Settings (Missing fields added appropriately) */}
                <div>
                  <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">
                    Listing Flags
                  </h3>
                  <div className="space-y-4">
                    {/* Active / Inactive Status Switch */}
                    <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex items-center justify-between">
                      <div className="pr-2">
                        <label className="text-sm font-semibold text-nordic block">
                          Propiedad Activa
                        </label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {isActive
                            ? "Visible en filtros de búsqueda y HomeScreen."
                            : "Desactivada: Oculta para clientes, visible solo en administración."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-mosque/30 flex-shrink-0 ${
                          isActive ? "bg-mosque" : "bg-gray-300"
                        }`}
                        title={isActive ? "Desactivar propiedad" : "Activar propiedad"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-nordic font-sf-pro">
                        Feature on Homepage
                      </span>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque cursor-pointer accent-[#006655]"
                      />
                    </label>

                    <div>
                      <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block">
                        Custom Badge (optional)
                      </label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="e.g. EXCLUSIVE, PRICE DROP"
                        className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Bar matching code.html */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/properties")}
              className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending || isUploading}
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <span className="material-icons text-sm">
                {isPending ? "hourglass_empty" : "save"}
              </span>
              {isPending
                ? "Saving..."
                : isEdit
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </main>

      {/* Footer matching code.html */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 font-sf-pro">
          © 2026 LuxeEstate Real Estate Inc. All rights reserved. <br />
          <span className="mt-2 block text-gray-300">
            Designed for modern agencies.
          </span>
        </div>
      </footer>
    </div>
  );
};
