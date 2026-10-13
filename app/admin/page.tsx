import Link from "next/link";
import { BriefcaseBusiness, Boxes, ClipboardList, UsersRound } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminApplications } from "@/components/site/admin-applications";
import { requireAdminPortal } from "@/lib/auth/session";

export default async function AdminPage() {
  const user = await requireAdminPortal();
  const [pendingApplications, activeMerchants, openPickups, totalShipments] = await Promise.all([
    prisma.user.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.user.count({ where: { role: "MERCHANT", status: "ACTIVE" } }),
    prisma.pickupRequest.count({
      where: { status: { in: ["REQUESTED", "SCHEDULED", "ASSIGNED"] } },
    }),
    prisma.shipment.count(),
  ]);

  return (
    <section className="mx-auto w-full max-w-300 px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="dashboard-eyebrow">Operations overview</p>
          <h1 className="dashboard-heading">
            {user.role === "ADMIN" ? "Admin dashboard" : `${user.role.toLowerCase()} dashboard`}
          </h1>
        </div>
        <span className="rounded-full border border-[#d8e0e8] bg-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5e6b7f]">
          {user.role} workspace
        </span>
      </div>
      <div className="mt-9 grid max-w-280 grid-cols-2 gap-4 lg:grid-cols-4">
        <article className="dashboard-surface relative overflow-hidden p-5 sm:p-6">
          <span className="absolute inset-x-0 top-0 h-1 bg-[#ec8123]" aria-hidden="true" />
          <ClipboardList className="mb-5 size-6 text-[#ec8123]" aria-hidden="true" />
          <p className="m-0 text-[13px] font-bold text-[#3f4148]">Open pickups</p>
          <p className="mb-0 mt-2 !text-[46px] font-bold leading-none text-[#163e6a]">
            {openPickups}
          </p>
        </article>
        <article className="dashboard-surface relative overflow-hidden p-5 sm:p-6">
          <span className="absolute inset-x-0 top-0 h-1 bg-[#163e6a]" aria-hidden="true" />
          <Boxes className="mb-5 size-6 text-[#163e6a]" aria-hidden="true" />
          <p className="m-0 text-[13px] font-bold text-[#3f4148]">Total shipments</p>
          <p className="mb-0 mt-2 !text-[46px] font-bold leading-none text-[#163e6a]">
            {totalShipments}
          </p>
        </article>
        <article className="dashboard-surface relative overflow-hidden p-5 sm:p-6">
          <span className="absolute inset-x-0 top-0 h-1 bg-[#e2b21d]" aria-hidden="true" />
          <UsersRound className="mb-5 size-6 text-[#b48700]" aria-hidden="true" />
          <p className="m-0 text-[13px] font-bold text-[#3f4148]">Pending merchants</p>
          <p className="mb-0 mt-2 !text-[46px] font-bold leading-none text-[#163e6a]">
            {pendingApplications}
          </p>
        </article>
        <article className="dashboard-surface relative overflow-hidden p-5 sm:p-6">
          <span className="absolute inset-x-0 top-0 h-1 bg-[#43a85b]" aria-hidden="true" />
          <BriefcaseBusiness className="mb-5 size-6 text-[#318044]" aria-hidden="true" />
          <p className="m-0 text-[13px] font-bold text-[#3f4148]">Active merchants</p>
          <p className="mb-0 mt-2 !text-[46px] font-bold leading-none text-[#163e6a]">
            {activeMerchants}
          </p>
        </article>
      </div>
      <div className="dashboard-surface mt-7 flex flex-wrap items-center gap-3 p-4">
        {(user.role === "ADMIN" || user.role === "OPERATIONS") && (
          <>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg bg-[#16171a] px-4 text-[12px] font-semibold text-white hover:bg-[#34353a]"
              href="/admin/pickups"
            >
              Pickup requests queue
            </Link>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg border border-[#d8d9dd] bg-white px-4 text-[12px] font-semibold text-[#34353a] hover:bg-[#f5f5f6]"
              href="/admin/shipments"
            >
              Manage shipments
            </Link>
          </>
        )}
        {(user.role === "ADMIN" || user.role === "FINANCE") && (
          <>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg bg-[#163e6a] px-4 text-[12px] font-semibold text-white hover:bg-[#ec8123]"
              href="/admin/remittances"
            >
              COD Remittances
            </Link>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg border border-[#d8d9dd] bg-white px-4 text-[12px] font-semibold text-[#34353a] hover:bg-[#f5f5f6]"
              href="/admin/merchants"
            >
              Merchant bank details
            </Link>
          </>
        )}
        {(user.role === "ADMIN" || user.role === "SUPPORT" || user.role === "OPERATIONS") && (
          <Link
            className="inline-flex min-h-10 items-center rounded-lg border border-[#d8d9dd] bg-white px-4 text-[12px] font-semibold text-[#34353a] hover:bg-[#f5f5f6]"
            href="/admin/tickets"
          >
            Support tickets
          </Link>
        )}
        {user.role === "ADMIN" && (
          <>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg border border-[#d8d9dd] bg-white px-4 text-[12px] font-semibold text-[#34353a] hover:bg-[#f5f5f6]"
              href="/admin/staff"
            >
              Staff accounts
            </Link>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg border border-[#d8d9dd] bg-white px-4 text-[12px] font-semibold text-[#34353a] hover:bg-[#f5f5f6]"
              href="/admin/audit"
            >
              Audit log
            </Link>
            <Link
              className="inline-flex min-h-10 items-center rounded-lg border border-[#d8d9dd] bg-white px-4 text-[12px] font-semibold text-[#34353a] hover:bg-[#f5f5f6]"
              href="/admin/settings"
            >
              System settings
            </Link>
          </>
        )}
      </div>
      {user.role === "ADMIN" && <AdminApplications />}
    </section>
  );
}
