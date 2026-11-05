"use client";

import React, { useState } from "react";

interface PropertyAboutProps {
  description?: string[];
  title: string;
}

export const PropertyAbout: React.FC<PropertyAboutProps> = ({
  description,
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const paragraphs = description && description.length > 0 ? description : [
    `Experience modern luxury in this architecturally stunning home located in the heart of prime residential real estate. Designed with an emphasis on indoor-outdoor living, the residence features floor-to-ceiling glass walls that flood the interiors with natural light.`,
    `The open-concept kitchen is equipped with top-of-the-line appliances and custom cabinetry, perfect for culinary enthusiasts. Retreat to the primary suite, a sanctuary of relaxation with a spa-inspired bath and private balcony.`,
    `A landscaped garden courtyard seamlessly complements outdoor dining, pool lounging, and evening gatherings under the stars.`,
  ];

  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
      <h2 className="text-lg font-semibold mb-4 text-nordic">
        About this home
      </h2>

      <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed space-y-4">
        {visibleParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {paragraphs.length > 2 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer focus:outline-none"
        >
          <span>{isExpanded ? "Show less" : "Read more"}</span>
          <span
            className={`material-icons text-sm transition-transform duration-300 ${
              isExpanded ? "rotate-90" : ""
            }`}
          >
            arrow_forward
          </span>
        </button>
      )}
    </div>
  );
};

