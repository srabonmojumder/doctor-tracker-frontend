"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({ className, classNames, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn("p-0", className)}
      classNames={{
        months: "flex flex-col gap-3",
        month: "space-y-3",
        month_caption: "flex items-center justify-center px-9 text-sm font-medium text-foreground",
        nav: "flex items-center justify-between absolute inset-x-1 top-0 h-8",
        button_previous:
          "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-30",
        button_next:
          "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground disabled:opacity-30",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-medium text-muted-foreground",
        week: "flex w-full mt-1",
        day: "w-9 h-9 text-center text-sm p-0 relative",
        day_button:
          "h-9 w-9 rounded-md text-sm text-foreground transition-colors hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
        today: "[&>button]:font-semibold [&>button]:text-primary",
        outside: "[&>button]:text-muted-foreground/50",
        disabled: "[&>button]:text-muted-foreground/30 [&>button]:pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === "left" ? <ChevronLeft className="h-4 w-4" {...chevronProps} /> : <ChevronRight className="h-4 w-4" {...chevronProps} />,
      }}
      {...props}
    />
  );
}
