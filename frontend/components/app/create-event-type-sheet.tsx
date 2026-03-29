import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, MapPin, Clock, Video, Phone, User, ExternalLink, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Location option types
type LocationType = "zoom" | "phone" | "in-person";
interface LocationSpec {
  type: LocationType;
  phoneDetails?: "invitee_number" | "provider_number";
  address?: string;
  note?: string;
}

const DURATIONS = [15, 30, 45, 60];

interface CreateEventTypeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventTypeSheet({ open, onOpenChange }: CreateEventTypeSheetProps) {
  const router = useRouter();
  const [eventName, setEventName] = useState("New Meeting");
  const [duration, setDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Accordion open states
  const [durationOpen, setDurationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);

  // Location states
  const [locations, setLocations] = useState<LocationSpec[]>([]);

  const handleCreate = async () => {
    if (!eventName.trim()) {
      toast.error("Event name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a slug from the name
      const slug = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const payload = {
        name: eventName,
        slug: slug || "meeting-" + Math.random().toString().slice(2, 8),
        duration: duration,
        // Stringify location config to send to backend loosely until prisma schema expands
        location: locations.length > 0 ? JSON.stringify(locations) : null
      };

      await api.post("/event-types", payload);
      toast.success("Event type created successfully");
      router.refresh(); // Refresh page data to show newly added event
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create event type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLocation = (type: LocationType) => {
    if (locations.find(l => l.type === type)) return;
    setLocations([...locations, { type }]);
  };

  const removeLocation = (type: LocationType) => {
    setLocations(locations.filter(l => l.type !== type));
  };

  const updateLocation = (type: LocationType, update: Partial<LocationSpec>) => {
    setLocations(locations.map(l => l.type === type ? { ...l, ...update } : l));
  };

  // Generate location summary
  const locationSummary = locations.length === 0 
    ? "None" 
    : locations.map(l => l.type === "zoom" ? "Zoom" : l.type === "phone" ? "Phone call" : "In-person").join(", ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[500px] p-0 overflow-y-auto bg-[#F9F9F9] border-l-[#D9D9D9] shadow-2xl">
        <SheetHeader className="p-6 pb-4 bg-white border-b border-[#EBEBEB] sticky top-0 z-10 hidden sm:block">
          <SheetTitle className="sr-only">New Event Type</SheetTitle>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase text-[#666666] tracking-wider">Event Type</div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#8247f5]"></div>
              <Input 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="text-2xl font-bold h-auto border-none shadow-none focus-visible:ring-1 focus-visible:ring-[#006BFF] px-2 -ml-2 rounded-md"
              />
            </div>
            <p className="text-[#666666] text-sm">One-on-One</p>
          </div>
        </SheetHeader>

        <div className="p-0">
          {/* Duration Section */}
          <SectionItem 
            title="Duration" 
            icon={<Clock className="w-[18px] h-[18px]" />}
            summary={`${duration} min`}
            isOpen={durationOpen}
            onToggle={() => setDurationOpen(!durationOpen)}
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "px-4 py-3 rounded-lg border text-sm font-medium transition-colors text-center shadow-sm",
                      duration === d 
                        ? "bg-[#E5F1FF] text-[#006BFF] border-[#006BFF]" 
                        : "bg-white text-[#1A1A1A] border-[#CCCCCC] hover:border-[#1A1A1A]"
                    )}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>
          </SectionItem>

          {/* Location Section */}
          <SectionItem 
            title="Location" 
            isOpen={locationOpen}
            onToggle={() => setLocationOpen(!locationOpen)}
          >
            <div className="flex flex-col gap-4">
              {/* Added Locations */}
              {locations.map((loc) => (
                <div key={loc.type} className="bg-white border text-left border-[#CCCCCC] rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-3 border-b border-[#EBEBEB] bg-white">
                    <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                      {loc.type === "zoom" && <Video className="w-5 h-5 text-[#4D5055]" />}
                      {loc.type === "phone" && <Phone className="w-5 h-5 text-[#4D5055]" />}
                      {loc.type === "in-person" && <MapPin className="w-5 h-5 text-[#4D5055]" />}
                      {loc.type === "zoom" ? "Zoom" : loc.type === "phone" ? "Phone call" : "In-person"}
                    </div>
                    <button onClick={() => removeLocation(loc.type)} className="p-1 text-[#666666] hover:bg-black/5 rounded-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Location specifics */}
                  <div className="p-4 bg-[#F9F9F9]">
                    {loc.type === "zoom" && (
                      <div className="bg-[#FFF5E6] border border-[#FFDDA1] p-4 rounded-lg flex flex-col gap-3">
                        <p className="text-[#1A1A1A] text-sm font-medium flex items-center gap-2">
                          <span className="text-xl">⚠️</span> Your Zoom account is not connected
                        </p>
                        <Button variant="outline" className="w-fit bg-transparent border-[#1A1A1A] rounded-full text-sm font-semibold">
                          Connect Zoom <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}

                    {loc.type === "phone" && (
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-[#1A1A1A]">How will you get in touch?</label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="radio" 
                              name="phoneDetails"
                              className="w-4 h-4 text-[#006BFF] focus:ring-[#006BFF]"
                              checked={loc.phoneDetails === "invitee_number" || !loc.phoneDetails}
                              onChange={() => updateLocation(loc.type, { phoneDetails: "invitee_number" })}
                            />
                            <span className="text-sm border-[#1A1A1A]">Require invitee's phone number.</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="radio" 
                              name="phoneDetails" 
                              className="w-4 h-4 text-[#006BFF] focus:ring-[#006BFF]"
                              checked={loc.phoneDetails === "provider_number"}
                              onChange={() => updateLocation(loc.type, { phoneDetails: "provider_number" })}
                            />
                            <span className="text-sm text-[#1A1A1A]">Provide a phone number to invitees after they book.</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {loc.type === "in-person" && (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#1A1A1A]">Location name/address</label>
                        <Textarea 
                          placeholder="(e.g. Hollywood Bowl, 2301 Highland Ave, Los Angeles, CA 90068)"
                          className={cn("bg-white min-h-[60px] resize-none", 
                            !loc.address ? "border-[#C84545] focus-visible:ring-[#C84545]" : ""
                          )}
                          value={loc.address || ""}
                          onChange={(e) => updateLocation(loc.type, { address: e.target.value })}
                        />
                        {!loc.address && <p className="text-xs text-[#C84545]">Physical location is required.</p>}
                        
                        <button className="text-[#006BFF] text-sm font-semibold flex items-center gap-1 mt-2 w-fit">
                          <Plus className="w-4 h-4" /> Add a note
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Location Options */}
              {locations.length > 0 && (
                <div className="bg-[#F9F9F9] border border-[#EBEBEB] p-4 rounded-xl flex flex-col gap-3">
                  <p className="text-[#1A1A1A] text-sm">Let your invitee choose from multiple meeting locations.</p>
                  <button className="text-[#006BFF] font-semibold text-sm flex items-center gap-1 w-fit">
                    <Plus className="w-4 h-4" /> Add location
                  </button>
                </div>
              )}

              {/* Initial Selection row */}
              {locations.length === 0 && (
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => addLocation('zoom')} className="flex flex-col items-center justify-center p-4 border border-[#CCCCCC] rounded-xl hover:border-[#1A1A1A] transition-colors gap-2 bg-white text-[#1A1A1A] shadow-sm">
                    <Video className="w-5 h-5 text-[#4D5055]" />
                    <span className="text-xs font-semibold">Zoom</span>
                  </button>
                  <button onClick={() => addLocation('phone')} className="flex flex-col items-center justify-center p-4 border border-[#CCCCCC] rounded-xl hover:border-[#1A1A1A] transition-colors gap-2 bg-white text-[#1A1A1A] shadow-sm">
                    <Phone className="w-5 h-5 text-[#4D5055]" />
                    <span className="text-xs font-semibold">Phone call</span>
                  </button>
                  <button onClick={() => addLocation('in-person')} className="flex flex-col items-center justify-center p-4 border border-[#CCCCCC] rounded-xl hover:border-[#1A1A1A] transition-colors gap-2 bg-white text-[#1A1A1A] shadow-sm">
                    <MapPin className="w-5 h-5 text-[#4D5055]" />
                    <span className="text-xs font-semibold">In-person</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-[#CCCCCC] rounded-xl hover:border-[#1A1A1A] transition-colors gap-2 bg-white text-[#1A1A1A] shadow-sm">
                    <ChevronUp className="w-5 h-5 text-[#4D5055]" />
                    <span className="text-xs font-semibold">All options</span>
                  </button>
                </div>
              )}
            </div>
          </SectionItem>

          {/* Availability Section */}
          <SectionItem 
            title="Availability" 
            summary="Weekdays, 9 am - 5 pm"
            isOpen={availabilityOpen}
            onToggle={() => setAvailabilityOpen(!availabilityOpen)}
          >
            <div className="mt-2 text-sm text-[#666666]">
              Standard weekday availability settings.
            </div>
          </SectionItem>

          {/* Host Section */}
          <SectionItem 
            title="Host" 
            summary="Avi Kumar (you)"
            isOpen={hostOpen}
            onToggle={() => setHostOpen(!hostOpen)}
          >
            <div className="mt-2 flex items-center gap-3 text-sm text-[#1A1A1A]">
              <div className="w-8 h-8 rounded-full bg-[#E5F1FF] text-[#006BFF] font-semibold flex items-center justify-center">
                A
              </div>
              Avi Kumar
            </div>
          </SectionItem>
        </div>

          {/* Footer sticky area */}
        <div className="sticky bottom-0 bg-white border-t border-[#EBEBEB] p-4 flex justify-between items-center z-20">
          <Button 
            variant="ghost" 
            className="text-[#1A1A1A] font-semibold hover:bg-[#F2F2F2] rounded-full px-6"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#006BFF] hover:bg-[#005BE6] text-white font-semibold px-8 py-2.5 rounded-full shadow-md transition-all disabled:opacity-50"
            onClick={handleCreate}
            disabled={isSubmitting || !eventName.trim()}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper generic section
function SectionItem({ 
  title, 
  summary, 
  icon,
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string, 
  summary?: string, 
  icon?: React.ReactNode,
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode 
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="border-b border-[#EBEBEB] bg-white">
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-6 hover:bg-[#F9F9F9] transition-colors focus:outline-none focus-visible:bg-[#F2F2F2]">
          <div className="flex flex-col items-start gap-1.5">
            <span className="font-bold text-[#1A1A1A] text-[15px]">{title}</span>
            {summary && !isOpen && (
              <div className="flex items-center gap-2 text-[15px] text-[#666666]">
                {icon && <span className="text-[#4D5055]">{icon}</span>}
                <span>{summary}</span>
              </div>
            )}
          </div>
          <div className="text-[#4D5055]">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-6 pt-0">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
