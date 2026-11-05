import React from "react";
import { Property } from "@/types/property";

interface PropertyJsonLdProps {
  property: Property;
  siteUrl?: string;
}

export const PropertyJsonLd: React.FC<PropertyJsonLdProps> = ({
  property,
  siteUrl = "https://luxeestate.com",
}) => {
  const schemaType =
    property.category === "Apartment" || property.category === "Penthouse"
      ? "Apartment"
      : "SingleFamilyResidence";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description?.[0] || property.title,
        url: `${siteUrl}/propiedades/${property.slug}`,
      },
      {
        "@type": schemaType,
        name: property.title,
        image: property.images || [property.imageUrl],
        numberOfRooms: property.beds,
        numberOfBathroomsTotal: property.baths,
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.sqm,
          unitCode: "MTK",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: property.location,
          addressCountry: "US",
        },
        geo: property.coordinates
          ? {
              "@type": "GeoCoordinates",
              latitude: property.coordinates.lat,
              longitude: property.coordinates.lng,
            }
          : undefined,
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          businessFunction:
            property.type === "rent"
              ? "https://schema.org/LeaseOut"
              : "https://schema.org/Sell",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: property.category,
            item: `${siteUrl}/?category=${property.category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: property.title,
            item: `${siteUrl}/propiedades/${property.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

