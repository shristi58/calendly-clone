import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarX, Plus } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-calendly-fade-in",
        className
      )}
    >
      <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
        {icon || <CalendarX className="size-7 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          id={`empty-state-action-${title.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={onAction}
          className="calendly-btn-hover"
        >
          <Plus data-icon="inline-start" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
