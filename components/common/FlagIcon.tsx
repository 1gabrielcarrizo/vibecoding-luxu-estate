"use client";

import React from "react";
import { Locale } from "@/lib/i18n/config";

interface FlagIconProps {
  locale: Locale;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  locale,
  className = "w-5 h-3.5",
}) => {
  switch (locale) {
    case "es":
      return (
        <span
          className={`inline-flex items-center justify-center flex-shrink-0 rounded-[3px] overflow-hidden shadow-2xs border border-black/10 ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 750 500"
            className="w-full h-full object-cover block"
          >
            <rect width="750" height="500" fill="#c60b1e" />
            <rect y="125" width="750" height="250" fill="#ffc400" />
            {/* Coat of arms simplified silhouette */}
            <circle cx="210" cy="250" r="42" fill="#c60b1e" opacity="0.85" />
            <path
              d="M190 230h40v35a20 20 0 01-40 0z"
              fill="#ffc400"
              stroke="#c60b1e"
              strokeWidth="4"
            />
          </svg>
        </span>
      );

    case "en":
      return (
        <span
          className={`inline-flex items-center justify-center flex-shrink-0 rounded-[3px] overflow-hidden shadow-2xs border border-black/10 ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 741 390"
            className="w-full h-full object-cover block"
          >
            {/* 13 stripes */}
            <rect width="741" height="390" fill="#b22234" />
            <path
              stroke="#fff"
              strokeWidth="30"
              d="M0 45h741M0 105h741M0 165h741M0 225h741M0 285h741M0 345h741"
            />
            {/* Canton */}
            <rect width="296" height="210" fill="#3c3b6e" />
            {/* Star Grid Pattern */}
            <g fill="#fff">
              <circle cx="50" cy="40" r="10" />
              <circle cx="110" cy="40" r="10" />
              <circle cx="170" cy="40" r="10" />
              <circle cx="230" cy="40" r="10" />

              <circle cx="80" cy="75" r="10" />
              <circle cx="140" cy="75" r="10" />
              <circle cx="200" cy="75" r="10" />

              <circle cx="50" cy="110" r="10" />
              <circle cx="110" cy="110" r="10" />
              <circle cx="170" cy="110" r="10" />
              <circle cx="230" cy="110" r="10" />

              <circle cx="80" cy="145" r="10" />
              <circle cx="140" cy="145" r="10" />
              <circle cx="200" cy="145" r="10" />

              <circle cx="50" cy="180" r="10" />
              <circle cx="110" cy="180" r="10" />
              <circle cx="170" cy="180" r="10" />
              <circle cx="230" cy="180" r="10" />
            </g>
          </svg>
        </span>
      );

    case "fr":
      return (
        <span
          className={`inline-flex items-center justify-center flex-shrink-0 rounded-[3px] overflow-hidden shadow-2xs border border-black/10 ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 900 600"
            className="w-full h-full object-cover block"
          >
            <rect width="300" height="600" fill="#002654" />
            <rect x="300" width="300" height="600" fill="#ffffff" />
            <rect x="600" width="300" height="600" fill="#ce1126" />
          </svg>
        </span>
      );

    default:
      return null;
  }
};

