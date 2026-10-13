"use client";

import { useMemo, useState } from "react";

import { TableFilterBar } from "@/components/site/table-filter-bar";

type ReportOrder = {
  id: string;
  trackingCode: string;
  status: string;
  serviceType: string;
  orderDate: string;
  pickupDate: string;
  orderId: string | null;
  pickupName: string | null;
  pickupPhone: string | null;
  pickupAddress: string | null;
  pickupCity: string | null;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  destinationCity: string;
};

const button =
  "rounded-lg bg-[#163e6a] px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ec8123]";
const field =
  "h-10 w-full rounded-lg border border-[#d9e0e8] bg-white px-3 text-[13px] text-[#455268] outline-none focus:border-[#163e6a]";
const exportButton =
  "border-r border-white/60 bg-[#163e6a] px-5 py-2.5 text-white transition hover:bg-[#ec8123]";

export function OrderReport({
  orders,
  pickupCompany,
}: {
  orders: ReportOrder[];
  pickupCompany: string;
}) {
  const [pickupCity, setPickupCity] = useState("ALL");
  const [deliveryCity, setDeliveryCity] = useState("ALL");
  const [payment, setPayment] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const cities = useMemo(
    () =>
      [
        ...new Set(orders.flatMap((o) => [o.pickupCity, o.destinationCity]).filter(Boolean)),
      ] as string[],
    [orders],
  );
  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (pickupCity === "ALL" || o.pickupCity === pickupCity) &&
          (deliveryCity === "ALL" || o.destinationCity === deliveryCity) &&
          (status === "ALL" || o.status === status) &&
          (!from || o.orderDate.slice(0, 10) >= from) &&
          (!to || o.orderDate.slice(0, 10) <= to) &&
          (!query ||
            `${o.trackingCode} ${o.recipientName} ${o.recipientPhone} ${o.orderId ?? ""}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [orders, pickupCity, deliveryCity, status, from, to, query],
  );
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const exportCsv = () => {
    const lines = [
      "Tracking No,API Tracking,Service,Status,Order Date,Pickup Date,Order ID,Pickup Name,Pickup Company,Pickup Phone,Pickup Address,Delivery Name,Delivery Phone,Delivery Address",
      ...filtered.map((o) =>
        [
          o.trackingCode,
          "",
          o.serviceType,
          o.status,
          o.orderDate,
          o.pickupDate,
          o.orderId ?? "",
          o.pickupName ?? "",
          pickupCompany,
          o.pickupPhone ?? "",
          o.pickupAddress ?? "",
          o.recipientName,
          o.recipientPhone,
          o.deliveryAddress,
        ]
          .map((value) => `"${value.replaceAll('"', '""')}"`)
          .join(","),
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "order-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold text-[#202126]">Order Report</h1>
      <TableFilterBar
        label="Report filters"
        summary={<span>{filtered.length} matching order(s)</span>}
      >
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Select
            label="Select Pickup City"
            value={pickupCity}
            onChange={setPickupCity}
            options={cities}
          />
          <Select
            label="Select Delivery City"
            value={deliveryCity}
            onChange={setDeliveryCity}
            options={cities}
          />
          <Select label="Payment Status" value={payment} onChange={setPayment} options={[]} />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={[...new Set(orders.map((o) => o.status))]}
          />
          <Select
            label="Date Type"
            value="Order Date"
            onChange={() => undefined}
            options={[]}
            disabled
          />
          <label className="grid gap-1 text-[20px] text-[#666]">
            Time From
            <input type="time" defaultValue="00:00" className={field} />
          </label>
          <label className="grid gap-1 text-[20px] text-[#666]">
            Time To
            <input type="time" defaultValue="23:59" className={field} />
          </label>
          <label className="grid gap-1 text-[20px] text-[#666]">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={field}
            />
          </label>
          <label className="grid gap-1 text-[20px] text-[#666]">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={field}
            />
          </label>
          <button type="button" className={`${button} self-end`} onClick={() => setQuery("")}>
            Submit
          </button>
          <button type="button" className={`${button} self-end`} onClick={exportCsv}>
            Export
          </button>
        </div>
      </TableFilterBar>
      <TableFilterBar label="Table tools" summary={<span>Export or print visible results</span>}>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <label className="text-[13px] text-[#455268]">
            Show{" "}
            <select className={`${field} inline-block w-28`}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>{" "}
            entries
          </label>
          <label className="min-w-0 text-[13px] text-[#455268]">
            Search:{" "}
            <input
              className={`${field} mt-1 sm:ml-2 sm:mt-0 sm:w-60`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className={exportButton}>Copy</button>
            <button className={exportButton} onClick={exportCsv}>
              CSV
            </button>
            <button className={exportButton} onClick={exportCsv}>
              Excel
            </button>
            <button className={exportButton} onClick={() => window.print()}>
              Print
            </button>
          </div>
          <button type="button" className={button} onClick={() => window.print()}>
            Print Invoice
          </button>
        </div>
      </TableFilterBar>
      <div className="overflow-x-auto border border-[#d7d7d7]">
        <table className="w-full min-w-275 border-collapse text-left text-[13px]">
          <thead className="bg-[#f5f5f5]">
            <tr>
              {[
                "",
                "Tracking No",
                "API Tracking #",
                "Service Type",
                "Status",
                "Order Date",
                "Pickup Date",
                "Order ID.",
                "Pickup Name",
                "Pickup Company",
                "Pickup Phone",
                "Pickup Address",
                "Delivery Name",
                "Delivery Phone",
                "Delivery Address",
              ].map((heading) => (
                <th key={heading} className="border border-[#ddd] px-3 py-3 font-bold text-[#555]">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="font-semibold align-top">
                <td className="border border-[#ddd] px-2 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(o.id)}
                    onChange={() => toggle(o.id)}
                  />
                </td>
                <td className="border border-[#ddd] px-3 py-3">{o.trackingCode}</td>
                <td className="border border-[#ddd] px-3 py-3">—</td>
                <td className="border border-[#ddd] px-3 py-3">{o.serviceType}</td>
                <td className="border border-[#ddd] px-3 py-3">{o.status.replaceAll("_", " ")}</td>
                <td className="border border-[#ddd] px-3 py-3">
                  {new Date(o.orderDate).toLocaleDateString("en-GB")}
                </td>
                <td className="border border-[#ddd] px-3 py-3">{o.pickupDate}</td>
                <td className="border border-[#ddd] px-3 py-3">{o.orderId ?? ""}</td>
                <td className="border border-[#ddd] px-3 py-3">{o.pickupName ?? ""}</td>
                <td className="border border-[#ddd] px-3 py-3">{pickupCompany}</td>
                <td className="border border-[#ddd] px-3 py-3">{o.pickupPhone ?? ""}</td>
                <td className="max-w-52 whitespace-normal border border-[#ddd] px-3 py-3">
                  {o.pickupAddress ?? ""}
                </td>
                <td className="border border-[#ddd] px-3 py-3">{o.recipientName}</td>
                <td className="border border-[#ddd] px-3 py-3">{o.recipientPhone}</td>
                <td className="max-w-52 whitespace-normal border border-[#ddd] px-3 py-3">
                  {o.deliveryAddress}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={15} className="bg-[#ddd] px-3 py-4 font-bold">
                Total
              </td>
            </tr>
            {!filtered.length && (
              <tr>
                <td colSpan={15} className="px-4 py-8 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1 text-[20px] text-[#666]">
      {label}
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={field}
      >
        <option value="ALL">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
