"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  badges?: string[];
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images,
  title,
  badges = ["Premium", "New"],
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const safeImages = images.length > 0 ? images : ["/placeholder.jpg"];
  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveIndex((prev) => (prev + 1) % safeImages.length);
    },
    [safeImages.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    },
    [safeImages.length]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  const getBadgeLabel = (b: string) => {
    const key = b.toLowerCase().trim().replace(/[^a-z]/g, "");
    if (key === "premium") return t("propertyDetail.badges.premium");
    if (key === "new" || key === "nuevo" || key === "nouveau")
      return t("propertyDetail.badges.new");
    if (key === "exclusive" || key === "exclusivo" || key === "exclusif")
      return t("propertyDetail.badges.exclusive");
    if (key === "featured" || key === "destacada" || key === "envedette")
      return t("propertyDetail.badges.featured");
    if (key === "pricecut" || key === "rebajada" || key === "prixreduit")
      return t("propertyDetail.badges.priceCut");
    if (key === "forsale" || key === "sale" || key === "venta" || key === "avendre")
      return t("propertyDetail.badges.forSale");
    if (key === "forrent" || key === "rent" || key === "alquiler" || key === "location")
      return t("propertyDetail.badges.forRent");
    return b;
  };

  return (
    <div className="space-y-4">
      {/* Hero Primary Image */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group bg-slate-100 cursor-pointer"
      >
        <Image
          src={currentImage}
          alt={`${title} - Photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {badges.map((b, i) => (
              <span
                key={b}
                className={
                  i === 0
                    ? "bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm"
                    : "bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm"
                }
              >
                {getBadgeLabel(b)}
              </span>
            ))}
          </div>
        )}

        {/* Previous / Next on Hero (hover or tap) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t("pagination.previous")}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <span className="material-icons text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={t("pagination.next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <span className="material-icons text-xl">chevron_right</span>
            </button>
          </>
        )}

        {/* View All Photos Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2 z-10 cursor-pointer"
        >
          <span className="material-icons text-sm">grid_view</span>
          <span>{t("propertyDetail.galleryAllPhotos")}</span>
          {safeImages.length > 1 && (
            <span className="text-xs text-nordic/60 ml-0.5">
              ({safeImages.length})
            </span>
          )}
        </button>
      </div>

      {/* Thumbnail Strip (1 to N images) */}
      {safeImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {safeImages.map((imgUrl, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex-none w-44 sm:w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer relative snap-start transition-all ${
                  isActive
                    ? "ring-2 ring-mosque ring-offset-2 ring-offset-clear-day opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-4">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-xs text-white/60">
                {t("propertyDetail.photoOf", {
                  current: activeIndex + 1,
                  total: safeImages.length,
                })}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label={t("propertyDetail.closeViewer")}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <span className="material-icons text-2xl">close</span>
            </button>
          </div>

          {/* Main Photo Center */}
          <div className="relative flex-1 w-full max-h-[75vh] flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl">
              <Image
                src={currentImage}
                alt={`${title} photo ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={t("pagination.previous")}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all cursor-pointer"
                >
                  <span className="material-icons text-2xl">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={t("pagination.next")}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all cursor-pointer"
                >
                  <span className="material-icons text-2xl">chevron_right</span>
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip in Lightbox */}
          {safeImages.length > 1 && (
            <div className="pt-4 flex justify-center overflow-x-auto scrollbar-hide gap-2 max-w-4xl mx-auto">
              {safeImages.map((img, i) => (
                <button
                  key={`lightbox-${img}-${i}`}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                    i === activeIndex
                      ? "ring-2 ring-white scale-105 opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
