"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, User, Video } from "lucide-react";
import { format, addMinutes } from "date-fns";
import type { Booking } from "@/types";

interface ConfirmationCardProps {
  booking: Booking;
  eventName: string;
  hostName: string;
}

function buildGoogleCalUrl(booking: Booking, eventName: string) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventName,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Booked via Calendly clone`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookCalUrl(booking: Booking, eventName: string) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: eventName,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: "Booked via Calendly clone",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function buildIcsContent(booking: Booking, eventName: string) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${eventName}`,
    "DESCRIPTION:Booked via Calendly clone",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function ConfirmationCard({
  booking,
  eventName,
  hostName,
}: ConfirmationCardProps) {
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  const handleDownloadIcs = () => {
    const icsContent = buildIcsContent(booking, eventName);
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventName.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto">
      {/* Success checkmark with animation */}
      <div className="relative mb-5" style={{ animation: "confirmBounce 600ms ease-out" }}>
        <div className="size-[72px] rounded-full bg-[#16A34A]/10 flex items-center justify-center">
          <CheckCircle2 className="size-10 text-[#16A34A]" strokeWidth={1.8} />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight mb-1">
        You are scheduled
      </h1>
      <p className="text-[14px] text-[#666666] mb-8">
        A calendar invitation has been sent to your email address.
      </p>

      {/* Event details card */}
      <div className="w-full bg-[#F8F8F8] rounded-xl p-6 text-left border border-[#EBEBEB]">
        <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-4">
          {eventName}
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[14px] text-[#4D4D4D]">
            <User className="size-[18px] text-[#8C8C8C] shrink-0" strokeWidth={2} />
            <span className="font-medium">{hostName}</span>
          </div>

          <div className="flex items-center gap-2.5 text-[14px] text-[#4D4D4D]">
            <Clock className="size-[18px] text-[#8C8C8C] shrink-0" strokeWidth={2} />
            <span>
              {format(startDate, "h:mma")} – {format(endDate, "h:mma")},{" "}
              {format(startDate, "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-[14px] text-[#4D4D4D]">
            <Video className="size-[18px] text-[#8C8C8C] shrink-0 mt-0.5" strokeWidth={2} />
            <span>Web conferencing details have been emailed.</span>
          </div>
        </div>
      </div>

      {/* Add to calendar buttons */}
      <div className="w-full mt-6 flex flex-col gap-2">
        <p className="text-[12px] text-[#999999] uppercase tracking-wider font-semibold mb-1">
          Add to calendar
        </p>
        <div className="flex gap-2 justify-center">
          <a
            href={buildGoogleCalUrl(booking, eventName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D9D9D9] text-[13px] font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
          >
            {/* Google Calendar icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#4285F4" d="M34.2 13.8H13.8v20.4h20.4V13.8z" opacity="0"/>
              <path fill="#EA4335" d="M34.2 48l13.8-13.8h-13.8V48z"/>
              <path fill="#34A853" d="M48 13.8V0H34.2v13.8H48z"/>
              <path fill="#188038" d="M34.2 13.8V0H13.8l0 0v13.8H34.2z" opacity="0"/>
              <path fill="#4285F4" d="M13.8 34.2V48h20.4V34.2H13.8z" opacity="0"/>
              <path fill="#1967D2" d="M13.8 48V34.2H0V48H13.8z"/>
              <path fill="#FBBC04" d="M0 13.8v20.4h13.8V13.8H0z"/>
              <path fill="#4285F4" d="M0 13.8h13.8V0H0V13.8z"/>
              <rect x="10" y="10" width="28" height="28" rx="2" fill="#fff"/>
              <path d="M22.7 30.3l-3.2-3.2 1.4-1.4 1.8 1.8 5-5 1.4 1.4-6.4 6.4z" fill="#1A73E8"/>
              <path d="M33 16H15v-2h18v2zm0 6H15v-2h18v2zm-8 6h-10v-2h10v2z" fill="#1A73E8" opacity="0.3"/>
            </svg>
            Google
          </a>
          <a
            href={buildOutlookCalUrl(booking, eventName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D9D9D9] text-[13px] font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
          >
            {/* Outlook icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#1976D2" d="M28 8H44V40H28z"/>
              <path fill="#2196F3" d="M28 8L0 12V36L28 40V8z"/>
              <path fill="#FFF" d="M14 17c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 13c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
              <path fill="#1976D2" d="M36 22v4h-8v-4h8z" opacity="0.5"/>
            </svg>
            Outlook
          </a>
          <button
            onClick={handleDownloadIcs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D9D9D9] text-[13px] font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
          >
            {/* Apple icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
              <path d="M36.6 40.2c-1.6 2.4-3.4 4.8-6 4.8-2.6 0-3.4-1.6-6.4-1.6-3 0-3.8 1.6-6.2 1.6-2.6.2-4.6-2.6-6.2-5-3.4-4.8-6-13.8-2.4-19.8 1.6-3 4.6-4.8 7.8-5 2.4 0 4.8 1.6 6.2 1.6 1.6 0 4.4-2 7.4-1.6 1.2 0 4.8.6 7 4.2-6.2 3.8-5.2 13.4 1.2 16-.8 2-1.2 3-2.4 4.8zM30 3c-4 .4-8.6 2.8-8.6 8.4 4.2.4 8.6-2.4 8.6-8.4z" fill="#333"/>
            </svg>
            Apple
          </button>
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes confirmBounce {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
