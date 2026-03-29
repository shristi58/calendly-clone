"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Info,
  Download,
  Filter,
  ChevronDown,
  CalendarDays,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBookingStore } from "@/stores/booking-store";
import Link from "next/link";
import type { Booking } from "@/types";

export default function MeetingsPage() {
  const { bookings, isLoading, fetch, cancel } = useBookingStore();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    if (activeTab === "Upcoming") {
      return bookings.filter(
        (b) => b.status === "scheduled" && !isPast(new Date(b.endTime))
      );
    }
    if (activeTab === "Past") {
      return bookings.filter(
        (b) => b.status !== "scheduled" || isPast(new Date(b.endTime))
      );
    }
    return bookings;
  }, [bookings, activeTab]);

  const totalCount = filteredBookings.length;
  const displayRange = totalCount > 0 ? `1 – ${totalCount}` : "0 – 0";

  const handleExport = () => {
    if (filteredBookings.length === 0) return;
    const headers = ["Date", "Time", "Invitee", "Email", "Event Type", "Status"];
    const rows = filteredBookings.map((b) => [
      format(new Date(b.startTime), "yyyy-MM-dd"),
      `${format(new Date(b.startTime), "h:mma")} – ${format(new Date(b.endTime), "h:mma")}`,
      b.inviteeName,
      b.inviteeEmail,
      b.eventType?.name || "Meeting",
      b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meetings-${activeTab.toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mb-8">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-[20px] font-bold text-[#1A1A1A]">Meetings</h1>
        <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
          <Info className="size-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="h-9 px-3 border border-[#D9D9D9] rounded-md text-sm font-medium flex items-center gap-2 text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors">
            My Calendly
            <ChevronDown className="size-4 text-[#666666]" />
          </button>

          <div className="flex items-center gap-2 text-[14px] text-[#1A1A1A]">
            <span>Show buffers</span>
            <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
              <Info className="size-4" strokeWidth={2} />
            </button>
            <Switch className="ml-1 data-[state=checked]:bg-[#006BFF]" />
          </div>
        </div>

        <div className="text-[12px] text-[#666666] font-medium tracking-wide">
          Displaying {displayRange} of {totalCount} Events
        </div>
      </div>

      {/* Main Content Area box */}
      <div className="border border-[#E5E5E5] rounded-xl bg-white shadow-sm mt-2">
        {/* Tabs and Actions Area */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-6 text-[14px] font-medium">
            {["Upcoming", "Past", "Date Range"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 relative transition-colors ${
                    isActive ? "text-[#006BFF]" : "text-[#666666] hover:text-[#1A1A1A]"
                  }`}
                >
                  {tab === "Date Range" ? (
                    <span className="flex items-center gap-1">
                      Date Range <ChevronDown className="size-4" />
                    </span>
                  ) : (
                    tab
                  )}
                  {isActive && tab !== "Date Range" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006BFF] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pb-4">
            <Button
              variant="outline"
              className="h-[36px] text-[#1A1A1A] px-4 font-semibold border-[#CCCCCC] rounded-full hover:bg-[#F2F2F2] flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="size-4 text-[#4D5055]" strokeWidth={2} />
              Export
            </Button>
            <Button
              variant="outline"
              className="h-[36px] text-[#1A1A1A] px-4 font-semibold border-[#CCCCCC] rounded-full hover:bg-[#F2F2F2] flex items-center gap-2"
            >
              <Filter className="size-4 text-[#4D5055]" strokeWidth={2} />
              Filter <ChevronDown className="size-4 -ml-1 text-[#4D5055]" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-[#006BFF]" />
          </div>
        )}

        {/* Booking List */}
        {!isLoading && filteredBookings.length > 0 ? (
          <div className="divide-y divide-[#EBEBEB]">
            {filteredBookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onCancel={(reason) => cancel(booking.id, { cancelReason: reason || undefined })}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center px-4">
              {/* Calendar illustration */}
              <div className="w-[120px] h-[100px] bg-gradient-to-b from-gray-100 to-white border-[3px] border-[#D9D9D9] rounded-xl relative shadow-sm flex flex-col mb-6">
                <div className="h-6 border-b-[3px] border-[#D9D9D9] bg-gray-50 flex items-center justify-center relative">
                  <div className="w-full absolute inset-x-0 bottom-[-3px] flex items-center justify-evenly">
                    <div className="w-[3px] h-[6px] bg-[#D9D9D9]" />
                    <div className="w-[3px] h-[6px] bg-[#D9D9D9]" />
                    <div className="w-[3px] h-[6px] bg-[#D9D9D9]" />
                    <div className="w-[3px] h-[6px] bg-[#D9D9D9]" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-4 grid-rows-3 gap-[3px] p-[3px]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-[#EBEBEB] w-full h-full rounded-sm opacity-60" />
                  ))}
                </div>
                <div className="absolute -top-3 -right-3 size-8 bg-[#8C8C8C] text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm ring-1 ring-black/5">
                  0
                </div>
              </div>

              <h2 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight mb-2">
                No Events Yet
              </h2>
              <p className="text-[14px] text-[#666666] mb-6">
                Share Event Type links to schedule events.
              </p>
              <Link href="/app/scheduling/meeting_types/user/me">
                <Button className="h-[44px] rounded-full bg-[#006BFF] hover:bg-[#005AE0] px-6 text-[14px] font-semibold text-white shadow-sm">
                  View Event Types
                </Button>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* Individual booking row component */
function BookingRow({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (reason: string) => void;
}) {
  const [cancelReason, setCancelReason] = useState("");
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  const statusColors = {
    scheduled: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    rescheduled: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const statusLabels = {
    scheduled: "Confirmed",
    cancelled: "Cancelled",
    rescheduled: "Rescheduled",
  };

  return (
    <div className="flex items-center gap-6 px-6 py-4 hover:bg-[#FAFAFA] transition-colors group">
      {/* Color indicator */}
      <div
        className="w-[4px] h-[40px] rounded-full shrink-0"
        style={{ backgroundColor: booking.eventType?.color || "#006BFF" }}
      />

      {/* Date & Time */}
      <div className="flex flex-col gap-0.5 min-w-[180px]">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A]">
          <Clock className="size-3.5 text-[#666666]" />
          {format(startDate, "h:mma")} – {format(endDate, "h:mma")}
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#666666]">
          <CalendarDays className="size-3.5" />
          {format(startDate, "EEEE, MMM d, yyyy")}
        </div>
      </div>

      {/* Invitee */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">
          {booking.inviteeName}
        </p>
        <p className="text-[12px] text-[#666666] truncate">{booking.inviteeEmail}</p>
      </div>

      {/* Event type & Status */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <p className="text-[13px] text-[#1A1A1A] truncate">
          {booking.eventType?.name || "Meeting"}
        </p>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit border ${
            statusColors[booking.status]
          }`}
        >
          {statusLabels[booking.status]}
        </span>
      </div>

      {/* Actions */}
      {booking.status === "scheduled" && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#666666] hover:text-destructive text-xs"
              >
                <X className="size-3.5 mr-1" />
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this meeting?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel the meeting with {booking.inviteeName} on{" "}
                  {format(startDate, "MMMM d")} at {format(startDate, "h:mma")}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2">
                <Textarea
                  placeholder="Reason for cancellation (optional)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep meeting</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onCancel(cancelReason)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Cancel meeting
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
