import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "accent" | "danger" | "warning";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted-foreground",
  primary: "bg-primary-muted text-primary",
  accent: "bg-accent/10 text-accent",
  danger: "bg-danger-muted text-danger",
  warning: "bg-warning/10 text-warning",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
