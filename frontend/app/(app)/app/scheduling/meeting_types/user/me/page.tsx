"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/auth-store";
import { useEventStore } from "@/stores/event-store";
import {
  Search,
  Info,
  Plus,
  ChevronDown,
  ExternalLink,
  CalendarDays,
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import type { EventType } from "@/types";
import { EventForm } from "@/components/dashboard/event-form";

export default function SchedulingPage() {
  const { user } = useAuthStore();
  const { eventTypes, isLoading, fetch: fetchEvents, remove, toggleActive } = useEventStore();
  const [activeTab, setActiveTab] = useState("Event types");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const username = user?.email?.split("@")[0] || "user";

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return eventTypes;
    return eventTypes.filter((e: EventType) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [eventTypes, searchQuery]);

  const handleCopyLink = (event: EventType) => {
    const link = `${window.location.origin}/${username}/${event.slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Scheduling</h1>
          <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            <Info className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-full bg-[#006BFF] hover:bg-[#005AE0] px-5 text-[14px] font-semibold shadow flex items-center gap-2">
              <Plus className="size-4" strokeWidth={2.5} />
              Create
              <ChevronDown className="size-4 opacity-80" strokeWidth={2.5} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Event Type</DialogTitle>
            </DialogHeader>
            <EventForm mode="create" onSuccess={() => { setShowCreateDialog(false); fetchEvents(); }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#D9D9D9] text-[14px] font-medium">
        {["Event types", "Single-use links", "Meeting polls"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab ? "text-[#006BFF]" : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006BFF]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Event types" && (
        <>
          {/* Toolbar / Search */}
          <div className="flex items-center pt-2">
            <div className="relative w-full max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#666666]" strokeWidth={2} />
              <Input
                placeholder="Search event types"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-[#D9D9D9] shadow-sm rounded-lg focus-visible:ring-[#006BFF]"
              />
            </div>
          </div>

          {/* User Link Card */}
          <div className="flex items-center justify-between py-2 border-b border-transparent hover:border-[#F2F2F2]">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 bg-[#E5F1FF] text-[#006BFF]">
                <AvatarFallback className="bg-transparent text-[#1A1A1A] font-semibold">
                  {user ? getInitials(user.name) : "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-[14px] font-bold text-[#1A1A1A]">
                {user?.name || "Loading..."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${username}`}
                className="flex items-center gap-1.5 text-[14px] text-[#006BFF] hover:underline font-medium"
              >
                <ExternalLink className="size-4" />
                View landing page
              </Link>
              <button className="text-[#666666] hover:bg-[#F2F2F2] p-1.5 rounded transition-colors">
                <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                  <circle cx="2" cy="2" r="2" />
                  <circle cx="2" cy="8" r="2" />
                  <circle cx="2" cy="14" r="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-[#006BFF]" />
            </div>
          )}

          {/* Event Cards or Empty State */}
          {!isLoading && filteredEvents.length > 0 ? (
            <div className="flex flex-col gap-0">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-5 px-4 py-4 border-b border-[#EBEBEB] hover:bg-[#FAFAFA] transition-colors group"
                >
                  {/* Color indicator */}
                  <div
                    className="w-[4px] h-[40px] rounded-full shrink-0"
                    style={{ backgroundColor: event.color || "#006BFF" }}
                  />

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold text-[#1A1A1A] truncate">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-[#666666]">{event.duration} min, One-on-One</span>
                    </div>
                    <Link
                      href={`/${username}/${event.slug}`}
                      className="text-[12px] text-[#006BFF] hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      View booking page <ExternalLink className="size-3" />
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold text-[#006BFF] border-[#006BFF] rounded-full hover:bg-[#E5F1FF] opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopyLink(event)}
                    >
                      <Copy className="size-3 mr-1" />
                      Copy link
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => handleCopyLink(event)}
                          >
                            <Copy className="size-4" />
                            Copy link
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive gap-2"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete event type?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &quot;{event.name}&quot; and all its
                                bookings. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => remove(event.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Switch
                      checked={event.isActive}
                      onCheckedChange={(checked) => toggleActive(event.id, checked)}
                      className="data-[state=checked]:bg-[#006BFF]"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="flex items-start justify-between mt-8 pr-12">
                <div className="max-w-[480px]">
                  <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-3">
                    Simplify your scheduling with event types
                  </h2>
                  <p className="text-[14px] leading-relaxed text-[#666666] mb-6">
                    Event types are templates for meetings you&apos;ll want to schedule regularly,
                    like product demos, customer calls, office hours, and more.
                  </p>
                  <button className="text-[14px] text-[#006BFF] hover:underline flex items-center gap-1 font-medium mb-8">
                    <Info className="size-4" /> Learn more <span className="ml-1 text-lg leading-none">›</span>
                  </button>

                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="h-[44px] rounded-full bg-[#006BFF] hover:bg-[#005AE0] px-6 text-[14px] font-semibold shadow flex items-center gap-2"
                  >
                    <Plus className="size-4" strokeWidth={2.5} />
                    New event type
                    <ChevronDown className="size-4 ml-1 opacity-80" strokeWidth={2.5} />
                  </Button>
                </div>

                {/* Illustration */}
                <div className="w-[300px] h-[220px] bg-gradient-to-tr from-[#E5F1FF] to-white rounded-3xl relative shadow flex-shrink-0 hidden lg:block">
                  <div className="absolute -left-12 top-6 bg-white shadow-md rounded-lg p-4 w-[200px] flex flex-col gap-4 border border-[#F2F2F2]">
                    <div className="text-[12px] font-bold text-[#1A1A1A]">One-on-one</div>
                    <div className="h-1.5 bg-[#EBEBEB] rounded-full w-full" />
                    <div className="text-[12px] font-bold text-[#1A1A1A] mt-2">Group</div>
                    <div className="h-1.5 bg-[#EBEBEB] rounded-full w-[80%]" />
                    <div className="text-[12px] font-bold text-[#1A1A1A] mt-2">Collective</div>
                    <div className="h-1.5 bg-[#EBEBEB] rounded-full w-full" />
                    <div className="text-[12px] font-bold text-[#1A1A1A] mt-2">Round robin</div>
                    <div className="h-1.5 bg-[#EBEBEB] rounded-full w-[85%]" />
                  </div>
                  <div className="absolute right-4 bottom-8 bg-white shadow-xl rounded-xl p-6 border border-[#EBEBEB] flex flex-col items-center justify-center">
                    <Avatar className="size-12 bg-gray-100 mb-4 border-2 border-white shadow-sm ring-1 ring-black/5">
                      <AvatarFallback>{user ? getInitials(user.name) : "AK"}</AvatarFallback>
                    </Avatar>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">Confirmed</div>
                    <CalendarDays className="size-5 mt-2 text-[#666666]" />
                  </div>
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== "Event types" && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarDays className="size-12 text-[#D9D9D9] mb-4" />
          <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-2">
            {activeTab}
          </h3>
          <p className="text-[14px] text-[#666666]">This feature is coming soon.</p>
        </div>
      )}
    </div>
  );
}
