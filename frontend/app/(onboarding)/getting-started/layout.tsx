import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
