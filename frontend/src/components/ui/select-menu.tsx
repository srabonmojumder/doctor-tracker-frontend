"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_VALUE = "__all__";

export interface SelectMenuOption {
  value: string;
  label: string;
}

export function SelectMenu({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectMenuOption[];
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <RadixSelect.Root
      value={value === "" ? ALL_VALUE : value}
      onValueChange={(next) => onValueChange(next === ALL_VALUE ? "" : next)}
    >
      <RadixSelect.Trigger
        aria-label={ariaLabel}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-foreground transition-shadow hover:border-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-50",
          className
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 overflow-hidden rounded-lg border border-border bg-surface"
          style={{ boxShadow: "var(--shadow-soft-lg)" }}
        >
          <RadixSelect.Viewport className="max-h-64 p-1" style={{ width: "var(--radix-select-trigger-width)" }}>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value || ALL_VALUE}
                value={option.value === "" ? ALL_VALUE : option.value}
                className="relative flex h-9 cursor-pointer select-none items-center rounded-md px-3 pr-8 text-sm text-foreground outline-none data-[highlighted]:bg-primary-muted data-[highlighted]:text-primary"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="absolute right-2 inline-flex items-center">
                  <Check className="h-4 w-4" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
