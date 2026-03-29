"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Feature comparison data
   ───────────────────────────────────────────── */
const CATEGORIES = [
  "View All",
  "Core features",
  "Customizations",
  "Team tools",
  "Integrations",
  "Security and control",
  "Support",
] as const;

type Category = (typeof CATEGORIES)[number];

interface Feature {
  name: string;
  category: Category;
  free: boolean;
  standard: boolean;
  teams: boolean;
  enterprise: boolean;
}

const FEATURES: Feature[] = [
  // Core features
  { name: "Meeting polls", category: "Core features", free: true, standard: true, teams: true, enterprise: true },
  { name: "Calendar connections", category: "Core features", free: true, standard: true, teams: true, enterprise: true },
  { name: "Automated event notifications", category: "Core features", free: true, standard: true, teams: true, enterprise: true },
  { name: "One-on-one scheduling", category: "Core features", free: true, standard: true, teams: true, enterprise: true },
  { name: "Group events", category: "Core features", free: false, standard: true, teams: true, enterprise: true },
  { name: "Collective events", category: "Core features", free: false, standard: false, teams: true, enterprise: true },
  { name: "Round robin events", category: "Core features", free: false, standard: false, teams: true, enterprise: true },
  // Customizations
  { name: "Custom branding", category: "Customizations", free: false, standard: true, teams: true, enterprise: true },
  { name: "Booking page customization", category: "Customizations", free: false, standard: true, teams: true, enterprise: true },
  { name: "Custom email notifications", category: "Customizations", free: false, standard: true, teams: true, enterprise: true },
  { name: "Redirects", category: "Customizations", free: false, standard: true, teams: true, enterprise: true },
  // Team tools
  { name: "Managed events", category: "Team tools", free: false, standard: false, teams: true, enterprise: true },
  { name: "Team reporting", category: "Team tools", free: false, standard: false, teams: true, enterprise: true },
  { name: "Admin center", category: "Team tools", free: false, standard: false, teams: true, enterprise: true },
  // Integrations
  { name: "Zoom integration", category: "Integrations", free: true, standard: true, teams: true, enterprise: true },
  { name: "Google Meet integration", category: "Integrations", free: true, standard: true, teams: true, enterprise: true },
  { name: "Salesforce", category: "Integrations", free: false, standard: false, teams: true, enterprise: true },
  { name: "HubSpot", category: "Integrations", free: false, standard: false, teams: true, enterprise: true },
  // Security and control
  { name: "SSO (SAML)", category: "Security and control", free: false, standard: false, teams: false, enterprise: true },
  { name: "SCIM provisioning", category: "Security and control", free: false, standard: false, teams: false, enterprise: true },
  { name: "Advanced security", category: "Security and control", free: false, standard: false, teams: false, enterprise: true },
  // Support
  { name: "24/7 live chat", category: "Support", free: false, standard: true, teams: true, enterprise: true },
  { name: "Dedicated CSM", category: "Support", free: false, standard: false, teams: false, enterprise: true },
];

/* ─────────────────────────────────────────────
   The Modal Component
   ───────────────────────────────────────────── */
export function PlanSelectionModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("planSelection") === "true";
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "monthly">("yearly");
  const [activeCategory, setActiveCategory] = useState<Category>("View All");

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("planSelection");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!isOpen) return null;

  const prices = {
    yearly: { standard: "$10", teams: "$16" },
    monthly: { standard: "$12", teams: "$20" },
  };
  const currentPrices = prices[billingPeriod];

  const filteredFeatures =
    activeCategory === "View All"
      ? FEATURES
      : FEATURES.filter((f) => f.category === activeCategory);

  // Group features by category for "View All"
  const groupedFeatures: Record<string, Feature[]> = {};
  filteredFeatures.forEach((f) => {
    if (!groupedFeatures[f.category]) groupedFeatures[f.category] = [];
    groupedFeatures[f.category].push(f);
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#E9EFF6] overflow-y-auto font-sans">
      <div className="w-full max-w-[1100px] mx-auto px-6 py-8 relative">
        {/* ── Close button ── */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-2 hover:bg-black/5 rounded-full transition-colors text-[#1A1A1A]"
          aria-label="Close plan selection"
        >
          <X className="size-6" strokeWidth={2} />
        </button>

        {/* ── Title ── */}
        <h1 className="text-center text-[28px] font-bold text-[#1A1A1A] mt-4 mb-8">
          Choose a plan that fits
        </h1>

        {/* ── Billing toggle ── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-[#F0F0F0] rounded-full p-1 text-sm font-semibold">
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={cn(
                "px-5 py-2 rounded-full transition-all duration-200",
                billingPeriod === "yearly"
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#666] hover:text-[#1A1A1A]"
              )}
            >
              Bill yearly (save up to 20%)
            </button>
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "px-5 py-2 rounded-full transition-all duration-200",
                billingPeriod === "monthly"
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#666] hover:text-[#1A1A1A]"
              )}
            >
              Bill monthly
            </button>
          </div>
        </div>

        {/* ── Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* Standard */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-7 flex flex-col">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Standard</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-[#1A1A1A]">{currentPrices.standard}</span>
              <span className="text-[13px] font-semibold text-[#666] uppercase">/seat/mo</span>
            </div>
            <p className="text-[14px] text-[#666] leading-relaxed mb-8 flex-1">
              Eliminate the back-and-forth between you and your customers with automated and
              personalized scheduling experiences.
            </p>
            <button className="w-full h-11 bg-[#006BFF] hover:bg-[#0060E6] text-white font-semibold rounded-full text-[15px] transition-colors">
              Select
            </button>
          </div>

          {/* Teams — MOST POPULAR */}
          <div className="bg-white rounded-xl border-2 border-[#0B3558] flex flex-col overflow-hidden">
            <div className="bg-[#0B3558] text-white text-center py-1.5 text-xs font-bold tracking-wider uppercase">
              Most Popular
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Teams</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-[#1A1A1A]">{currentPrices.teams}</span>
                <span className="text-[13px] font-semibold text-[#666] uppercase">/seat/mo</span>
              </div>
              <p className="text-[14px] text-[#666] leading-relaxed mb-8 flex-1">
                Collaborate effectively with team members and drive business results with smart
                automations, reporting, and advanced scheduling options.
              </p>
              <button className="w-full h-11 bg-[#006BFF] hover:bg-[#0060E6] text-white font-semibold rounded-full text-[15px] transition-colors">
                Select
              </button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-7 flex flex-col">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                Starts at $15k
              </span>
              <span className="text-[13px] font-semibold text-[#666] uppercase">per year</span>
            </div>
            <p className="text-[14px] text-[#666] leading-relaxed mb-8 flex-1">
              Standardize the scheduling experience for your organization and access
              enterprise-level security, admin control, and personalized support.
            </p>
            <button className="w-full h-11 bg-[#006BFF] hover:bg-[#0060E6] text-white font-semibold rounded-full text-[15px] transition-colors">
              Contact sales
            </button>
          </div>
        </div>

        {/* ── Feature Comparison ── */}
        <div className="mb-16">
          <h2 className="text-center text-xl font-bold text-[#1A1A1A] mb-6">
            Compare features by category
          </h2>

          {/* Category tabs */}
          <div className="flex items-center gap-1 border-b border-[#E5E5E5] mb-0 overflow-x-auto pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-3 text-[14px] font-medium whitespace-nowrap transition-colors relative shrink-0",
                  activeCategory === cat
                    ? "text-[#1A1A1A] font-semibold"
                    : "text-[#666] hover:text-[#1A1A1A]"
                )}
              >
                {cat}
                {activeCategory === cat && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006BFF] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Feature table */}
          <div className="bg-white rounded-b-xl border border-t-0 border-[#E5E5E5] overflow-hidden">
            {Object.entries(groupedFeatures).map(([category, features]) => (
              <div key={category}>
                {/* Category header row */}
                <div className="grid grid-cols-[1fr_100px_100px_100px_120px] items-center border-b border-[#F0F0F0] bg-[#FAFAFA]">
                  <div className="px-6 py-4 text-[15px] font-bold text-[#1A1A1A]">{category}</div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-[#666] uppercase tracking-wider">Free</div>
                    <div className="text-[13px] font-bold text-[#1A1A1A]">$0</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-[#666] uppercase tracking-wider">Standard</div>
                    <div className="text-[13px] font-bold text-[#1A1A1A]">{currentPrices.standard}</div>
                    <button className="text-[12px] text-[#006BFF] font-semibold mt-0.5">Select {">"}</button>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-[#666] uppercase tracking-wider">Teams</div>
                    <div className="text-[13px] font-bold text-[#1A1A1A]">{currentPrices.teams}</div>
                    <button className="text-[12px] text-[#006BFF] font-semibold mt-0.5">Select {">"}</button>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-[#666] uppercase tracking-wider">Enterprise</div>
                    <div className="text-[13px] font-bold text-[#1A1A1A]">Starts at $15k</div>
                    <button className="text-[12px] text-[#006BFF] font-semibold mt-0.5">Select {">"}</button>
                  </div>
                </div>

                {/* Feature rows */}
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="grid grid-cols-[1fr_100px_100px_100px_120px] items-center border-b border-[#F5F5F5] last:border-b-0"
                  >
                    <div className="px-6 py-3 text-[14px] text-[#1A1A1A] font-medium">{feature.name}</div>
                    <div className="flex justify-center">
                      {feature.free ? (
                        <Check className="size-5 text-[#006BFF]" strokeWidth={2.5} />
                      ) : (
                        <span className="text-[#D9D9D9]">—</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.standard ? (
                        <Check className="size-5 text-[#006BFF]" strokeWidth={2.5} />
                      ) : (
                        <span className="text-[#D9D9D9]">—</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.teams ? (
                        <Check className="size-5 text-[#006BFF]" strokeWidth={2.5} />
                      ) : (
                        <span className="text-[#D9D9D9]">—</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.enterprise ? (
                        <Check className="size-5 text-[#006BFF]" strokeWidth={2.5} />
                      ) : (
                        <span className="text-[#D9D9D9]">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
