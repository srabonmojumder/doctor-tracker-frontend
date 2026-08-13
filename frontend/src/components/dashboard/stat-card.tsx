import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatTone = "primary" | "accent" | "warning" | "purple" | "rose";

const TONE_CONFIG: Record<
  StatTone,
  {
    iconBg: string;
    glowBg: string;
    borderHover: string;
    badgeBg: string;
    badgeText: string;
    accentLine: string;
  }
> = {
  primary: {
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25",
    glowBg: "from-blue-500/10 via-indigo-500/5 to-transparent",
    borderHover: "group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300",
    badgeText: "Active Roster",
    accentLine: "from-blue-500 to-indigo-500",
  },
  accent: {
    iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-teal-500/25",
    glowBg: "from-teal-500/10 via-emerald-500/5 to-transparent",
    borderHover: "group-hover:border-teal-500/40 dark:group-hover:border-teal-400/40",
    badgeBg: "bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300",
    badgeText: "Total Registered",
    accentLine: "from-teal-500 to-emerald-500",
  },
  warning: {
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25",
    glowBg: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderHover: "group-hover:border-amber-500/40 dark:group-hover:border-amber-400/40",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300",
    badgeText: "Avg Ratio",
    accentLine: "from-amber-500 to-orange-500",
  },
  purple: {
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-purple-500/25",
    glowBg: "from-purple-500/10 via-violet-500/5 to-transparent",
    borderHover: "group-hover:border-purple-500/40 dark:group-hover:border-purple-400/40",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300",
    badgeText: "Specialties",
    accentLine: "from-purple-500 to-violet-500",
  },
  rose: {
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/25",
    glowBg: "from-rose-500/10 via-pink-500/5 to-transparent",
    borderHover: "group-hover:border-rose-500/40 dark:group-hover:border-rose-400/40",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300",
    badgeText: "Overview",
    accentLine: "from-rose-500 to-pink-500",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  badge,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: StatTone;
  badge?: string;
}) {
  const config = TONE_CONFIG[tone] || TONE_CONFIG.primary;
  const badgeLabel = badge || config.badgeText;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/40 border border-border/80 backdrop-blur-sm",
        config.borderHover
      )}
    >
      {/* Top Accent Gradient Bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-90 transition-opacity group-hover:opacity-100", config.accentLine)} />

      {/* Subtle Background Glow */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-radial opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-125",
          config.glowBg
        )}
      />

      <div className="relative flex flex-col justify-between h-full gap-4">
        {/* Header row with Icon and Badge */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110",
              config.iconBg
            )}
          >
            <Icon className="h-6 w-6 stroke-[2.2]" />
          </div>

          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
              config.badgeBg
            )}
          >
            {badgeLabel}
          </span>
        </div>

        {/* Content row with Label & Large Value */}
        <div className="space-y-1 pt-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/90">{label}</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono leading-none">
              {value}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

