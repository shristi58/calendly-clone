import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarPlus, CheckCircle2, Clock, User, Video } from "lucide-react";
import { format } from "date-fns";
import type { Booking } from "@/types";

interface ConfirmationCardProps {
  booking: Booking;
  eventName: string;
  hostName: string;
}

export function ConfirmationCard({
  booking,
  eventName,
  hostName,
}: ConfirmationCardProps) {
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto animate-calendly-fade-in">
      {/* Success icon */}
      <div className="size-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mb-4">
        <CheckCircle2 className="size-8 text-[#16A34A]" strokeWidth={2} />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
        You are scheduled
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        A calendar invitation has been sent to your email address.
      </p>

      {/* Event details card */}
      <div className="w-full bg-muted rounded-xl p-6 text-left">
        <h2 className="text-base font-semibold text-foreground mb-4">
          {eventName}
        </h2>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="size-4 shrink-0" />
            <span>{hostName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" />
            <span>
              {format(startDate, "h:mma")} – {format(endDate, "h:mma")},{" "}
              {format(startDate, "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Video className="size-4 shrink-0 mt-0.5" />
            <span>Web conferencing details have been emailed.</span>
          </div>
        </div>
      </div>

      {/* Add to calendar button */}
      <Button
        variant="outline"
        className="mt-6 calendly-btn-hover"
        id="confirmation-add-calendar"
      >
        <CalendarPlus data-icon="inline-start" />
        Add to Calendar
      </Button>
    </div>
  );
}
