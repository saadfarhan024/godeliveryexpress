import type { ReactNode } from "react";

type TableFilterBarProps = {
  children: ReactNode;
  label?: string;
  summary?: ReactNode;
};

/**
 * Keeps data-table filters out of the way on phones while preserving the
 * always-visible, horizontal workspace controls on larger screens.
 */
export function TableFilterBar({ children, label = "Filters", summary }: TableFilterBarProps) {
  return (
    <details className="group rounded-2xl border border-[#e5eaf0] bg-white shadow-[0_4px_16px_rgba(24,25,30,0.03)]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[13px] font-semibold text-[#163e6a] marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <span className="text-[11px] font-medium text-[#758196] group-open:hidden">
          Tap to refine
        </span>
        <span className="hidden text-[11px] font-medium text-[#758196] group-open:inline">
          Hide filters
        </span>
      </summary>
      <div className="hidden min-w-0 flex-col gap-3 border-t border-[#edf0f4] p-3 group-open:flex sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:border-t-0 sm:p-4">
        {children}
      </div>
      {summary && (
        <div className="hidden border-t border-[#edf0f4] px-4 py-2 text-[12px] text-[#758196] sm:flex sm:items-center sm:justify-between">
          {summary}
        </div>
      )}
    </details>
  );
}
