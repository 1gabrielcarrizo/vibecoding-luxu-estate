"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Property, PropertyAgent } from "@/types/property";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  agent: PropertyAgent;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  property,
  agent,
}) => {
  const [visitType, setVisitType] = useState<"in-person" | "video">("in-person");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${agent.name}, I'd like to schedule a ${
      visitType === "in-person" ? "in-person tour" : "video walkthrough"
    } for ${property.title} on ${selectedDate || "this week"} at ${selectedTime}. My name is ${
      name || "Client"
    }.`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-mosque/10 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-nordic">Schedule a Private Tour</h3>
            <p className="text-xs text-nordic/60 mt-0.5">{property.title} • {property.location}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-nordic/40 hover:text-nordic p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-mosque/10 text-mosque rounded-full mx-auto flex items-center justify-center">
              <span className="material-icons text-3xl">check_circle</span>
            </div>
            <h4 className="text-xl font-semibold text-nordic">
              Tour Request Received!
            </h4>
            <p className="text-sm text-nordic/70 max-w-sm mx-auto">
              {agent.name} has been notified and will confirm your {visitType === "in-person" ? "presential visit" : "video walkthrough"} for <strong>{selectedDate} at {selectedTime}</strong> shortly.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <a
                href={`https://wa.me/15553498201?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-icons text-sm">chat</span>
                <span>Confirm Instantly via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-nordic py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Tour Type Selector */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setVisitType("in-person")}
                className={`py-2 px-3 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  visitType === "in-person"
                    ? "bg-white text-nordic shadow-xs"
                    : "text-nordic/60 hover:text-nordic"
                }`}
              >
                <span className="material-icons text-sm">place</span>
                In-Person Tour
              </button>
              <button
                type="button"
                onClick={() => setVisitType("video")}
                className={`py-2 px-3 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  visitType === "video"
                    ? "bg-white text-nordic shadow-xs"
                    : "text-nordic/60 hover:text-nordic"
                }`}
              >
                <span className="material-icons text-sm">videocam</span>
                Video Walkthrough
              </button>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  Select Date *
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  Preferred Time *
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic bg-white focus:outline-none focus:border-mosque"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>
            </div>

            {/* Contact details */}
            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
            </div>

            {/* Agent info preview */}
            <div className="p-3 bg-mosque/5 rounded-lg border border-mosque/10 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={agent.avatarUrl}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-nordic block">
                  Tour hosted by {agent.name}
                </span>
                <span className="text-nordic/60">{agent.role}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full bg-mosque hover:bg-primary-hover text-white py-3.5 px-4 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span className="material-icons text-sm">calendar_today</span>
              <span>Confirm Appointment Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

