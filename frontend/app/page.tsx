import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { CustomerStories } from "@/components/landing/customer-stories";
import { FeaturesHowItWorks } from "@/components/landing/features-how-it-works";
import { FeaturesIntegrations } from "@/components/landing/features-integrations";
import { Stats } from "@/components/landing/stats";
import { SecurityBadges } from "@/components/landing/security-badges";
import { PricingSnippet } from "@/components/landing/pricing-snippet";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navigation />
      
      <main>
        <Hero />
        <CustomerStories />
        <FeaturesHowItWorks />
        <FeaturesIntegrations />
        <SecurityBadges />
        <Stats />
        <PricingSnippet />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
