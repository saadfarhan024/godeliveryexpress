import type { ReactNode } from "react";
import Link from "next/link";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortalSidebar } from "@/components/site/portal-sidebar";
import { requireAdminPortal } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminPortal();
  const items = [
    { href: "/admin", label: "Overview", icon: "BarChart3" as const, show: true },
    {
      href: "/admin/pickups",
      label: "Pickup queue",
      icon: "ClipboardList" as const,
      show: user.role === "ADMIN" || user.role === "OPERATIONS",
    },
    {
      href: "/admin/shipments",
      label: "Shipments",
      icon: "Boxes" as const,
      show: user.role === "ADMIN" || user.role === "OPERATIONS",
    },
    {
      href: "/admin/order-report",
      label: "Order report",
      icon: "BarChart3" as const,
      show: user.role === "ADMIN" || user.role === "OPERATIONS",
    },
    {
      href: "/admin/shipper-report",
      label: "Shipper report",
      icon: "BarChart3" as const,
      show: user.role === "ADMIN" || user.role === "OPERATIONS",
    },
    {
      href: "/admin/scan-sheet",
      label: "Scan sheet",
      icon: "ClipboardList" as const,
      show: user.role === "ADMIN" || user.role === "OPERATIONS",
    },
    {
      href: "/admin/remittances",
      label: "COD remittances",
      icon: "Landmark" as const,
      show: user.role === "ADMIN" || user.role === "FINANCE",
    },
    {
      href: "/admin/merchants",
      label: "Merchants",
      icon: "Store" as const,
      show: user.role === "ADMIN" || user.role === "FINANCE",
    },
    {
      href: "/admin/tickets",
      label: "Support tickets",
      icon: "Ticket" as const,
      show: user.role === "ADMIN" || user.role === "SUPPORT" || user.role === "OPERATIONS",
    },
    {
      href: "/admin/staff",
      label: "Staff accounts",
      icon: "Users" as const,
      show: user.role === "ADMIN",
    },
    {
      href: "/admin/audit",
      label: "Audit log",
      icon: "FileClock" as const,
      show: user.role === "ADMIN",
    },
    {
      href: "/admin/settings",
      label: "System settings",
      icon: "Settings" as const,
      show: user.role === "ADMIN",
    },
    {
      href: "/admin/change-password",
      label: "Change password",
      icon: "KeyRound" as const,
      show: true,
    },
  ].filter((item) => item.show);

  return (
    <SidebarProvider>
      <PortalSidebar items={items} admin />
      <SidebarInset className="dashboard-scale bg-[#f7f9fc]">
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-[#e5eaf0] bg-white/90 px-4 text-[#172033] shadow-[0_4px_20px_rgba(25,45,75,0.04)] backdrop-blur-xl">
          <SidebarTrigger className="text-[#163e6a] hover:bg-[#eef4f9]" />
          <Link
            prefetch={false}
            className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#163e6a]"
            href="/admin"
          >
            Operations workspace
          </Link>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
