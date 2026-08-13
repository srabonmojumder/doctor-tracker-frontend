"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;

export function PopoverContent({ className, align = "start", sideOffset = 8, ...props }: ComponentProps<typeof RadixPopover.Content>) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        sideOffset={sideOffset}
        className={cn("z-50 rounded-xl border border-border bg-surface p-3 outline-none", className)}
        style={{ boxShadow: "var(--shadow-soft-lg)" }}
        {...props}
      />
    </RadixPopover.Portal>
  );
}
