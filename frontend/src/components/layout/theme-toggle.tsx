"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// next-themes sets the `dark` class on <html> via a blocking script before
// hydration, but its React context value can briefly disagree with the DOM
// during the client's first paint - branching rendered output on that value
// directly causes a hydration mismatch. Reading the DOM class itself through
// useSyncExternalStore (server snapshot = false, matching SSR) sidesteps it,
// the same pattern used for the sidebar's collapsed state.
function subscribeToHtmlClass(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getIsDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getIsDarkServerSnapshot() {
  return false;
}

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { setTheme } = useTheme();
  const isDark = useSyncExternalStore(subscribeToHtmlClass, getIsDarkSnapshot, getIsDarkServerSnapshot);

  return (
    <button
      type="button"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "shrink-0 rounded-lg p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-sidebar-text-active",
        collapsed && "mx-auto"
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
