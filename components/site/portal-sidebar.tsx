"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Boxes,
  Cable,
  ChartNoAxesCombined,
  CircleUserRound,
  ClipboardList,
  FileClock,
  FileSpreadsheet,
  KeyRound,
  Landmark,
  LayoutDashboard,
  MessageSquareText,
  PackagePlus,
  PackageSearch,
  Settings,
  ShieldCheck,
  Store,
  Ticket,
  Truck,
  UserRoundPlus,
  Users,
  SquarePlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@/components/site/sign-out-button";

const icons = {
  BarChart3,
  Boxes,
  Cable,
  ChartNoAxesCombined,
  SquarePlus,
  CircleUserRound,
  ClipboardList,
  FileClock,
  FileSpreadsheet,
  KeyRound,
  Landmark,
  LayoutDashboard,
  MessageSquareText,
  PackagePlus,
  PackageSearch,
  Settings,
  ShieldCheck,
  Store,
  Ticket,
  Truck,
  UserRoundPlus,
  Users,
};

type PortalSidebarItem = { href: string; label: string; icon: keyof typeof icons };

export function PortalSidebar({
  items,
  admin = false,
  companyName,
}: {
  items: PortalSidebarItem[];
  admin?: boolean;
  companyName?: string;
}) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-[#dfe3e8] bg-white [&_[data-slot=sidebar-inner]]:bg-white [&_[data-slot=sidebar-inner]]:text-[#34353a]"
    >
      <SidebarHeader className="border-b border-[#e5eaf0] bg-[#102d4e] p-5">
        <Link
          prefetch={false}
          className="mx-auto block w-34 rounded-xl bg-white p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
          href={admin ? "/admin" : "/account"}
          aria-label="Go Delivery Express dashboard"
        >
          <Image
            src="/logo.png"
            alt="Go Delivery Express"
            width={152}
            height={108}
            className="h-auto w-full"
            priority
          />
        </Link>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
          <ShieldCheck className="size-4 text-[#ec8123]" aria-hidden="true" />{" "}
          {admin ? "Admin portal" : "Merchant portal"}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#fbfcfe] p-3">
        <SidebarMenu className="gap-1.5">
          {items.map(({ href, label, icon }) => {
            const Icon = icons[icon];
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} prefetch={false} />}
                  tooltip={label}
                  size="lg"
                  className="h-10.5 rounded-xl text-[#5e6b7f] hover:bg-[#eaf2f8] hover:text-[#163e6a]"
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#dfe3e8] p-4">
        {companyName && (
          <p className="truncate px-2 text-[12px] font-semibold text-[#34353a]">{companyName}</p>
        )}
        <div className="mt-2 inline-flex rounded-lg bg-[#163e6a]">
          <SignOutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
