"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, Stethoscope, Users, X } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useLogout, useMe } from "@/hooks/useAuth";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: Users },
];

// A tiny external store for the sidebar's collapsed preference. Using
// useSyncExternalStore (rather than reading localStorage in a useEffect)
// avoids a hydration-mismatch flash and the setState-in-effect anti-pattern.
const SIDEBAR_COLLAPSED_KEY = "dt-sidebar-collapsed";
let sidebarListeners: Array<() => void> = [];

function subscribeSidebar(callback: () => void) {
  sidebarListeners.push(callback);
  return () => {
    sidebarListeners = sidebarListeners.filter((listener) => listener !== callback);
  };
}

function getSidebarSnapshot() {
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
}

function getSidebarServerSnapshot() {
  return false;
}

function setSidebarCollapsed(value: boolean) {
  window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, value ? "1" : "0");
  sidebarListeners.forEach((listener) => listener());
}

function useSidebarCollapse() {
  const collapsed = useSyncExternalStore(subscribeSidebar, getSidebarSnapshot, getSidebarServerSnapshot);

  function toggle() {
    setSidebarCollapsed(!collapsed);
  }

  return { collapsed, toggle };
}

function NavLinks({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
              "group relative flex items-center rounded-lg py-2.5 text-sm font-medium",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
              active ? "bg-sidebar-active text-sidebar-text-active" : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                active ? "opacity-100" : "opacity-0"
              )}
            />
            <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-sidebar-icon-active" : "text-sidebar-text group-hover:text-sidebar-text-active")} />
            {!collapsed && label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-primary/30"
        style={{ background: "var(--gradient-brand)" }}
      >
        <Stethoscope className="h-[18px] w-[18px]" />
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-sidebar-text-active">Doctor Tracker</p>
          <p className="truncate text-[11px] text-sidebar-text">Admin panel</p>
        </div>
      )}
    </div>
  );
}

function AccountSection({ collapsed }: { collapsed?: boolean }) {
  const { data: admin } = useMe();
  const logout = useLogout();
  const avatarLabel = admin?.email ? initials(admin.email.split("@")[0]) : "A";

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 border-t border-sidebar-border p-3">
        <span
          title={admin?.email}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
          style={{ background: "var(--gradient-brand)" }}
        >
          {avatarLabel}
        </span>
        <ThemeToggle collapsed />
        <button
          type="button"
          title="Sign out"
          aria-label="Sign out"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="rounded-lg p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-sidebar-text-active disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-2.5 rounded-xl p-2">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
          style={{ background: "var(--gradient-brand)" }}
        >
          {avatarLabel}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-sidebar-text-active">{admin?.email ?? "Admin"}</p>
          <p className="text-[11px] text-sidebar-text">Administrator</p>
        </div>
        <ThemeToggle />
        <button
          type="button"
          title="Sign out"
          aria-label="Sign out"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="shrink-0 rounded-lg p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-sidebar-text-active disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col border-r border-sidebar-border transition-[width] duration-200 ease-in-out md:flex",
        collapsed ? "w-20" : "w-64"
      )}
      style={{ background: "linear-gradient(180deg, var(--sidebar-bg) 0%, var(--sidebar-bg-soft) 100%)" }}
    >
      <div className={cn("flex h-16 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
        <BrandMark collapsed={collapsed} />
      </div>

      <button
        type="button"
        onClick={toggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border text-sidebar-text shadow-md transition-colors hover:text-sidebar-text-active"
        style={{ background: "var(--sidebar-bg-soft)" }}
      >
        {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
      </button>

      <NavLinks collapsed={collapsed} />
      <AccountSection collapsed={collapsed} />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button aria-label="Close menu" className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="relative flex h-full w-72 flex-col shadow-2xl"
        style={{ background: "linear-gradient(180deg, var(--sidebar-bg) 0%, var(--sidebar-bg-soft) 100%)" }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <BrandMark />
          <button aria-label="Close menu" onClick={onClose} className="rounded-md p-1.5 text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active">
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
        <AccountSection />
      </div>
    </div>
  );
}
