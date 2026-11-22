"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import { defaultAgent } from "@/data/mockData";
import { Navbar } from "@/components/common/Navbar";
import { ContactAgentModal } from "@/components/property/ContactAgentModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/supabase/AuthContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";

interface ScheduleVisitScreenProps {
  property: Property;
  initialTodayIso: string;
}

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:30 AM",
  "01:00 PM",
  "02:00 PM",
  "03:30 PM",
];

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

export const ScheduleVisitScreen: React.FC<ScheduleVisitScreenProps> = ({
  property,
  initialTodayIso,
}) => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { displayName } = useAuth();

  const today = useMemo(() => parseIsoDate(initialTodayIso), [initialTodayIso]);
  const defaultSelected = useMemo(() => addDays(today, 1), [today]);

  const [viewYear, setViewYear] = useState<number>(defaultSelected.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(defaultSelected.getMonth());
  const [selectedIso, setSelectedIso] = useState<string>(
    toIsoDate(
      defaultSelected.getFullYear(),
      defaultSelected.getMonth(),
      defaultSelected.getDate()
    )
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");
  const [message, setMessage] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const displayTitle = getLocalizedTitle(property.slug, locale, property.title);
  const agent = property.agent || defaultAgent;

  const primaryImage =
    (property.images && property.images.length > 0
      ? property.images[0]
      : property.imageUrl) ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const isRent = property.type === "rent";
  const priceSuffixText =
    property.priceSuffix &&
    (property.priceSuffix.includes("/mo") ||
      property.priceSuffix.includes("/mes"))
      ? t("propertyDetail.perMonth")
      : property.priceSuffix || (isRent ? t("propertyDetail.perMonth") : "");

  const localeTag =
    locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US";

  // Month label (e.g., "November 2026" / "noviembre de 2026")
  const monthLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat(localeTag, {
      month: "long",
      year: "numeric",
    }).format(new Date(viewYear, viewMonth, 1));
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [localeTag, viewYear, viewMonth]);

  // Formatted selected date for confirmation & WhatsApp
  const formattedSelectedDate = useMemo(() => {
    const date = parseIsoDate(selectedIso);
    const formatted = new Intl.DateTimeFormat(localeTag, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [localeTag, selectedIso]);

  // Weekday headers starting Monday (matching code.html)
  const weekdays = useMemo(
    () => [
      t("scheduleVisit.weekdays.mon"),
      t("scheduleVisit.weekdays.tue"),
      t("scheduleVisit.weekdays.wed"),
      t("scheduleVisit.weekdays.thu"),
      t("scheduleVisit.weekdays.fri"),
      t("scheduleVisit.weekdays.sat"),
      t("scheduleVisit.weekdays.sun"),
    ],
    [t]
  );

  // Build calendar grid (Monday-first, including trailing days of previous month)
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    // JS getDay(): 0 = Sun, 1 = Mon ... 6 = Sat -> convert to Mon=0..Sun=6
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const todayTimestamp = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    const cells: Array<{
      key: string;
      day: number;
      iso: string;
      inCurrentMonth: boolean;
      disabled: boolean;
    }> = [];

    // Leading days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevDate = new Date(viewYear, viewMonth - 1, prevDay);
      cells.push({
        key: `prev-${prevDay}`,
        day: prevDay,
        iso: toIsoDate(
          prevDate.getFullYear(),
          prevDate.getMonth(),
          prevDate.getDate()
        ),
        inCurrentMonth: false,
        disabled: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const cellTime = new Date(viewYear, viewMonth, day).getTime();
      const iso = toIsoDate(viewYear, viewMonth, day);
      cells.push({
        key: iso,
        day,
        iso,
        inCurrentMonth: true,
        disabled: cellTime < todayTimestamp,
      });
    }

    return cells;
  }, [viewYear, viewMonth, today]);

  const canGoPrevMonth =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Mark one deterministic unavailable slot (01:00 PM matching code.html)
  const unavailableSlots = useMemo(() => {
    const dayNum = Number(selectedIso.split("-")[2]) || 1;
    const blocked = new Set<string>(["01:00 PM"]);
    if (dayNum % 4 === 0) blocked.add("09:30 AM");
    return blocked;
  }, [selectedIso]);

  const handleSelectDate = (iso: string) => {
    setSelectedIso(iso);
    const dayNum = Number(iso.split("-")[2]) || 1;
    if (selectedTime === "09:30 AM" && dayNum % 4 === 0) {
      setSelectedTime("10:00 AM");
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  const handleCancel = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/propiedades/${property.slug}`);
    }
  };

  const whatsappMessage = encodeURIComponent(
    t("scheduleVisit.whatsappMessage", {
      agent: agent.name,
      title: displayTitle,
      date: formattedSelectedDate,
      time: selectedTime,
      name: displayName || t("scheduleVisit.guestName"),
      note: message.trim() ? ` — ${message.trim()}` : "",
    })
  );

  const bedsLabel =
    property.beds === 1 ? t("favorites.bedSingular") : t("favorites.bedsPlural");
  const bathsLabel =
    property.baths === 1
      ? t("favorites.bathSingular")
      : t("favorites.bathsPlural");

  return (
    <div className="bg-clear-day min-h-screen flex flex-col antialiased selection:bg-mosque/20 selection:text-mosque font-display text-nordic">
      <Navbar isDetailPage={true} />

      <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-8">
        {/* Back Link */}
        <div className="w-full max-w-6xl mb-6">
          <Link
            href={`/propiedades/${property.slug}`}
            className="flex items-center gap-2 group text-nordic/60 hover:text-mosque transition-colors w-fit"
          >
            <span className="material-icons text-xl group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="font-medium">
              {t("scheduleVisit.backToDetails")}
            </span>
          </Link>
        </div>

        {/* Main Split Card — faithful to schedule_visit_screen/code.html */}
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl shadow-mosque/5 overflow-hidden flex flex-col md:flex-row border border-slate-100">
          {/* Left Panel: Property Summary & Agent */}
          <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 lg:p-10 flex flex-col gap-6 relative">
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-mosque/5 to-transparent pointer-events-none" />

            <Link
              href={`/propiedades/${property.slug}`}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-[4/3] block bg-slate-200"
            >
              <Image
                alt={property.imageAlt || displayTitle}
                src={primaryImage}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 42vw"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-mosque">
                {isRent
                  ? t("propertyDetail.badges.forRent")
                  : t("propertyDetail.badges.forSale")}
              </div>
            </Link>

            <div className="space-y-4 z-10">
              <div>
                <Link
                  href={`/propiedades/${property.slug}`}
                  className="hover:text-mosque transition-colors"
                >
                  <h2 className="text-2xl font-bold text-nordic leading-tight">
                    {displayTitle}
                  </h2>
                </Link>
                <p className="text-slate-500 mt-1 flex items-center gap-1 text-sm">
                  <span className="material-icons text-base">location_on</span>
                  <span>{property.location}</span>
                </p>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-slate-200 gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    {t("scheduleVisit.priceLabel")}
                  </span>
                  <span className="text-xl font-bold text-mosque">
                    {property.formattedPrice}
                    {priceSuffixText && (
                      <span className="text-sm font-medium text-nordic/60">
                        {priceSuffixText}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-slate-600">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400">bed</span>
                    <span className="text-xs font-medium whitespace-nowrap">
                      {property.beds} {bedsLabel}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400">
                      shower
                    </span>
                    <span className="text-xs font-medium whitespace-nowrap">
                      {property.baths} {bathsLabel}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400">
                      square_foot
                    </span>
                    <span className="text-xs font-medium whitespace-nowrap">
                      {property.sqm.toLocaleString("en-US")}{" "}
                      {t("propertyCard.sqm")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-slate-200">
                  <Image
                    alt={agent.name}
                    src={agent.avatarUrl}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500 font-medium">
                    {t("scheduleVisit.hostedBy")}
                  </p>
                  <p className="text-nordic font-semibold truncate">
                    {agent.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="ml-auto p-2 text-mosque hover:bg-mosque/10 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  title={t("propertyDetail.contactAgent")}
                  aria-label={t("propertyDetail.contactAgent")}
                >
                  <span className="material-icons block">
                    chat_bubble_outline
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Date/Time Scheduler or Confirmation */}
          <div className="w-full md:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
            {isConfirmed ? (
              <div className="my-auto py-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-hint-green text-mosque flex items-center justify-center mb-5 shadow-sm">
                  <span className="material-icons text-4xl">check_circle</span>
                </div>

                <h1 className="text-3xl font-bold text-nordic mb-2">
                  {t("scheduleVisit.confirmedTitle")}
                </h1>
                <p className="text-slate-500 max-w-md mb-8">
                  {t("scheduleVisit.confirmedSubtitle", { agent: agent.name })}
                </p>

                {/* Booking Summary Box */}
                <div className="w-full max-w-md bg-slate-50 rounded-xl p-5 border border-slate-100 text-left space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-mosque text-lg">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                        {t("scheduleVisit.summaryDate")}
                      </p>
                      <p className="font-semibold text-nordic">
                        {formattedSelectedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-icons text-mosque text-lg">
                      schedule
                    </span>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                        {t("scheduleVisit.summaryTime")}
                      </p>
                      <p className="font-semibold text-nordic">
                        {selectedTime}
                      </p>
                    </div>
                  </div>
                  {message.trim() && (
                    <div className="flex items-start gap-3 text-sm pt-2 border-t border-slate-200/70">
                      <span className="material-icons text-mosque text-lg mt-0.5">
                        notes
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                          {t("scheduleVisit.summaryNote")}
                        </p>
                        <p className="text-nordic/80 break-words">
                          {message.trim()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-md flex flex-col gap-3">
                  <a
                    href={`https://wa.me/15553498201?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span className="material-icons text-base">chat</span>
                    <span>{t("propertyDetail.whatsappChat")}</span>
                  </a>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsConfirmed(false)}
                      className="py-2.5 px-4 rounded-lg border border-slate-200 text-nordic hover:border-mosque hover:text-mosque font-medium text-sm transition-colors cursor-pointer"
                    >
                      {t("scheduleVisit.changeDateTime")}
                    </button>
                    <Link
                      href={`/propiedades/${property.slug}`}
                      className="py-2.5 px-4 rounded-lg bg-mosque hover:bg-primary-dark text-white font-medium text-sm transition-colors text-center"
                    >
                      {t("scheduleVisit.backToProperty")}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleConfirm}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  <h1 className="text-3xl font-bold text-nordic mb-2">
                    {t("scheduleVisit.title")}
                  </h1>
                  <p className="text-slate-500 mb-8">
                    {t("scheduleVisit.subtitle")}
                  </p>

                  {/* Monthly Calendar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-nordic uppercase tracking-wider">
                        {monthLabel}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          disabled={!canGoPrevMonth}
                          aria-label={t("scheduleVisit.prevMonth")}
                          className={`p-1 rounded-full transition-colors ${
                            canGoPrevMonth
                              ? "hover:bg-slate-100 text-nordic hover:text-mosque cursor-pointer"
                              : "text-slate-300 cursor-not-allowed"
                          }`}
                        >
                          <span className="material-icons text-lg block">
                            chevron_left
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          aria-label={t("scheduleVisit.nextMonth")}
                          className="p-1 rounded-full hover:bg-slate-100 text-nordic hover:text-mosque transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-lg block">
                            chevron_right
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center mb-6">
                      {weekdays.map((dayName) => (
                        <div
                          key={dayName}
                          className="text-xs font-medium text-slate-400 py-2"
                        >
                          {dayName}
                        </div>
                      ))}

                      {calendarDays.map((cell) => {
                        const isSelected =
                          cell.inCurrentMonth && cell.iso === selectedIso;

                        if (cell.disabled) {
                          return (
                            <button
                              key={cell.key}
                              type="button"
                              disabled
                              className="text-sm text-slate-300 py-2 rounded-lg cursor-not-allowed"
                            >
                              {cell.day}
                            </button>
                          );
                        }

                        if (isSelected) {
                          return (
                            <button
                              key={cell.key}
                              type="button"
                              aria-pressed="true"
                              onClick={() => handleSelectDate(cell.iso)}
                              className="relative bg-mosque text-white font-semibold shadow-lg shadow-mosque/30 py-2 rounded-lg transform scale-105 cursor-pointer"
                            >
                              {cell.day}
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                            </button>
                          );
                        }

                        return (
                          <button
                            key={cell.key}
                            type="button"
                            aria-pressed="false"
                            onClick={() => handleSelectDate(cell.iso)}
                            className="text-sm text-slate-600 hover:bg-slate-100 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Times */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-nordic uppercase tracking-wider mb-4">
                      {t("scheduleVisit.availableTimes")}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {TIME_SLOTS.map((slot) => {
                        const isUnavailable = unavailableSlots.has(slot);
                        const isSelected = selectedTime === slot;

                        if (isUnavailable) {
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled
                              className="border border-slate-200 text-slate-300 py-2 px-3 rounded-lg text-sm cursor-not-allowed opacity-50 decoration-slate-400 line-through"
                            >
                              {slot}
                            </button>
                          );
                        }

                        if (isSelected) {
                          return (
                            <button
                              key={slot}
                              type="button"
                              aria-pressed="true"
                              onClick={() => setSelectedTime(slot)}
                              className="bg-mosque/10 border border-mosque text-mosque font-medium py-2 px-3 rounded-lg text-sm shadow-sm cursor-pointer"
                            >
                              {slot}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={slot}
                            type="button"
                            aria-pressed="false"
                            onClick={() => setSelectedTime(slot)}
                            className="border border-slate-200 text-slate-500 py-2 px-3 rounded-lg text-sm hover:border-mosque hover:text-mosque transition-all cursor-pointer"
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Message for the Agent */}
                  <div className="mb-8">
                    <label
                      className="block text-sm font-semibold text-nordic uppercase tracking-wider mb-2"
                      htmlFor="schedule-agent-message"
                    >
                      {t("scheduleVisit.messageLabel")}{" "}
                      <span className="text-slate-400 font-normal normal-case ml-1">
                        ({t("scheduleVisit.optional")})
                      </span>
                    </label>
                    <textarea
                      id="schedule-agent-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("scheduleVisit.messagePlaceholder")}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 text-nordic placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-mosque focus:border-mosque transition-shadow resize-none text-sm p-3"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-slate-500 hover:text-nordic font-medium px-4 py-2 text-sm transition-colors cursor-pointer"
                  >
                    {t("scheduleVisit.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="bg-mosque hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-mosque/20 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t("scheduleVisit.confirmVisit")}</span>
                    <span className="material-icons text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Minimalist Centered Footer matching schedule_visit_screen/code.html */}
      <footer className="py-8 text-center text-nordic/40 text-xs">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link className="hover:text-mosque transition-colors" href="#">
            {t("footer.privacy")}
          </Link>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <Link className="hover:text-mosque transition-colors" href="#">
            {t("footer.terms")}
          </Link>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <Link className="hover:text-mosque transition-colors" href="#">
            {t("scheduleVisit.support")}
          </Link>
        </div>
        <p>{t("footer.rights")}</p>
      </footer>

      {/* Agent Contact Modal from the left panel chat button */}
      <ContactAgentModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        property={{ ...property, title: displayTitle }}
        agent={agent}
      />
    </div>
  );
};
