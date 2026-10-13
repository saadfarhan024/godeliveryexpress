import type { ReactNode } from "react";
import Link from "next/link";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SiteFooter } from "@/components/site/site-footer";
import { PortalSidebar } from "@/components/site/portal-sidebar";
import { requireMerchant } from "@/lib/auth/session";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await requireMerchant();
  const companyName = user.merchantProfile?.companyName ?? user.email;
  const items = [
    { href: "/account", label: "Dashboard", icon: "LayoutDashboard" as const },
    { href: "/account/shipments/new", label: "Create shipment", icon: "PackagePlus" as const },
    { href: "/account/orders", label: "Orders List", icon: "ClipboardList" as const },
    { href: "/account/order-report", label: "Order Report", icon: "BarChart3" as const },
    { href: "/account/shipper-report", label: "Shipper report", icon: "BarChart3" as const },
    {
      href: "/account/comments-report",
      label: "Comments report",
      icon: "MessageSquareText" as const,
    },
    { href: "/account/shipments", label: "Shipments", icon: "Boxes" as const },
    {
      href: "/account/shipments/bulk-upload",
      label: "Upload Bulk Sheet",
      icon: "FileSpreadsheet" as const,
    },
    { href: "/account/pickup-profiles", label: "Pickup profiles", icon: "UserRoundPlus" as const },
    { href: "/account/tracking", label: "Track your deliveries", icon: "PackageSearch" as const },
    { href: "/account/pickups", label: "Generate load sheet", icon: "ClipboardList" as const },
    { href: "/account/scan-sheet", label: "Scan sheet", icon: "ClipboardList" as const },
    { href: "/account/load-sheets", label: "Load sheet log", icon: "FileClock" as const },
    { href: "/account/remittances", label: "Remittances", icon: "ChartNoAxesCombined" as const },
    {
      href: "/account/tickets",
      label: "Suggestions / Complaints",
      icon: "MessageSquareText" as const,
    },
    { href: "/account/integrations", label: "Integrations", icon: "Cable" as const },
    { href: "/account/profile", label: "Edit Account", icon: "CircleUserRound" as const },
    { href: "/account/change-password", label: "Change password", icon: "KeyRound" as const },
  ];

  return (
    <SidebarProvider>
      <PortalSidebar items={items} companyName={companyName} />
      <SidebarInset className="dashboard-scale bg-[#f7f9fc]">
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-[#e5eaf0] bg-white/90 px-4 text-[#172033] shadow-[0_4px_20px_rgba(25,45,75,0.04)] backdrop-blur-xl">
          <SidebarTrigger className="text-[#163e6a] hover:bg-[#eef4f9]" />
          <Link
            prefetch={false}
            className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#163e6a]"
            href="/account"
          >
            Merchant workspace
          </Link>
        </header>
        {children}
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
