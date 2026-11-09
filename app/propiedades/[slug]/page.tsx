import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPropertyBySlug, getAllPropertySlugs } from "@/lib/supabase/properties";
import { Navbar } from "@/components/common/Navbar";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertySidebar } from "@/components/property/PropertySidebar";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyAbout } from "@/components/property/PropertyAbout";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { MortgageCalculatorSection } from "@/components/property/MortgageCalculatorSection";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { PropertyJsonLd } from "@/components/property/PropertyJsonLd";
import { PropertyBreadcrumb } from "@/components/property/PropertyBreadcrumb";

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Static params generation for ISR / static pre-rendering
 */
export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Dynamic SEO metadata generation
 */
export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found — LuxeEstate",
      description: "The requested luxury property could not be found.",
    };
  }

  const title = `${property.title} — ${property.formattedPrice} | LuxeEstate`;
  const description = `${property.title} in ${property.location}. Featuring ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.sqm} m². Available now for ${property.formattedPrice}.`;

  const primaryImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 800,
          alt: property.imageAlt || property.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
  };
}

/**
 * Property Details Screen Server Component (RSC)
 */
export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const allImages =
    property.images && property.images.length > 0
      ? property.images
      : [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      ];

  const badges =
    property.badges && property.badges.length > 0
      ? property.badges
      : property.badge
        ? [property.badge]
        : ["Premium", "New"];

  return (
    <div className="min-h-screen bg-clear-day text-nordic selection:bg-mosque/20 font-display flex flex-col">
      {/* Schema.org Structured Data */}
      <PropertyJsonLd property={property} />

      {/* Navigation Bar with Logo linking to Home */}
      <Navbar isDetailPage={true} />

      {/* Main Content Container matching code.html */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <PropertyBreadcrumb
          category={property.category}
          title={property.title}
          slug={property.slug}
        />

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8">
          {/* Top Left: 1 to N Images Gallery */}
          <div className="lg:col-span-8 space-y-4">
            <PropertyGallery
              images={allImages}
              title={property.title}
              badges={badges}
              slug={property.slug}
            />
          </div>

          {/* Right Column: Pricing, Agent Card & Interactive Leaflet Map */}
          <PropertySidebar property={property} />

          {/* Bottom Left: Features, About, Amenities, Mortgage */}
          <div className="lg:col-span-8 lg:row-start-2 lg:-mt-8 space-y-6 sm:space-y-8">
            {/* Features (Sqm, Beds, Baths, Garage) */}
            <PropertyFeatures
              sqm={property.sqm}
              beds={property.beds}
              baths={property.baths}
              garage={property.garage ?? 2}
            />

            {/* About this home */}
            <PropertyAbout
              slug={property.slug}
              description={property.description}
              title={property.title}
            />

            {/* Amenities Grid */}
            <PropertyAmenities amenities={property.amenities} />

            {/* Mortgage Calculator Section */}
            <MortgageCalculatorSection
              price={property.price}
              estimatedPayment={property.estimatedPayment}
            />
          </div>
        </div>
      </main>

      {/* Footer matching code.html */}
      <PropertyFooter />
    </div>
  );
}

