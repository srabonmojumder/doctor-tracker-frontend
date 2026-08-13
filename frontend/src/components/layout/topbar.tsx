"use client";

import { Menu } from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-surface/80 px-4 backdrop-blur-md md:hidden">
      <button
        aria-label="Open menu"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground hover:bg-surface-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="ml-3 text-sm font-semibold text-foreground">Doctor Tracker</span>
    </header>
  );
}
