"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-full max-w-7xl flex-col">
            <div className="flex-1">{children}</div>

            <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row">
              <span className="flex items-center gap-1.5 font-medium text-foreground/70">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-md text-white"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Stethoscope className="h-3 w-3" />
                </span>
                Doctor Tracker
              </span>
              <span>&copy; {new Date().getFullYear()} Doctor Tracker. All rights reserved.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
