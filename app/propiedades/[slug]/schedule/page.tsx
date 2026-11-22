import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  getPropertyBySlug,
  getAllPropertySlugs,
} from "@/lib/supabase/properties";
import { ScheduleVisitScreen } from "@/components/schedule/ScheduleVisitScreen";
import ScheduleVisitLoading from "./loading";

interface SchedulePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SchedulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Schedule Visit — LuxeEstate",
      description: "Schedule a private viewing with LuxeEstate.",
    };
  }

  return {
    title: `Schedule Visit: ${property.title} — LuxeEstate`,
    description: `Choose a date and time to tour ${property.title} in ${property.location} with LuxeEstate.`,
  };
}

async function ScheduleVisitContent({ params }: SchedulePageProps) {
  await connection();
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <ScheduleVisitScreen property={property} initialTodayIso={todayIso} />
  );
}

export default function ScheduleVisitPage(props: SchedulePageProps) {
  return (
    <Suspense fallback={<ScheduleVisitLoading />}>
      <ScheduleVisitContent params={props.params} />
    </Suspense>
  );
}
