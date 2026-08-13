"use client";

import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function toDateOnly(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function toValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = toDateOnly(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-foreground transition-shadow hover:border-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-left">
            {selected ? selected.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : placeholder}
          </span>
          {selected && (
            <X
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(date ? toValue(date) : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
