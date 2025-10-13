"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import EmptyDataValidation from "./EmptyDataState";

export type TableColumn = {
  label: string;
  key: string;
  sortable?: boolean;
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
};

interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[] | null;
  loading?: boolean;
  error?: string;
  pageSize?: number;
  onDetail?: (row: Record<string, any>) => void;
  showAction?: boolean;
  actionColumnLabel?: string;
}

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span className="ml-1">
      {direction === "asc" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 6L11 9H5L8 6Z" fill={active ? "#fff" : "#CBD5E1"} />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 10L5 7H11L8 10Z" fill={active ? "#fff" : "#CBD5E1"} />
        </svg>
      )}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  // Build page list with ellipsis
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (page <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
  }

  const isPrevDisabled = page <= 1 || totalPages <= 1;
  const isNextDisabled = page >= totalPages || totalPages <= 1;

  return (
    <div className="flex flex-row items-center gap-2 select-none">
      {/* Prev */}
      <button
        type="button"
        className="p-2 bg-[#F1F5F9] rounded-full flex items-center justify-center disabled:opacity-50"
        disabled={isPrevDisabled}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        aria-label="Prev"
        title="Previous page"
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <path d="M11 13L6 8L11 3" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            type="button"
            key={p}
            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-inter text-[11px] font-semibold transition
              ${p === page ? "bg-[#0F124A] text-white" : "bg-[#E2E8F0] text-[#0F172A]"}
            `}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 6,
              paddingBottom: 6,
              borderRadius: 30,
            }}
            onClick={() => setPage(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ) : (
          <span
            key={`ellipsis-${idx}`}
            className="w-[30px] h-[30px] flex items-center justify-center text-[#0F172A] font-inter text-[11px]"
            style={{ fontFamily: "Figtree, Inter" }}
          >
            ...
          </span>
        )
      )}

      {/* Next */}
      <button
        type="button"
        className="p-2 bg-[#E2E8F0] rounded-full flex items-center justify-center disabled:opacity-50"
        disabled={isNextDisabled}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        aria-label="Next"
        title="Next page"
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <path d="M5 3L10 8L5 13" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  error = "",
  pageSize = 10,
  onDetail,
  showAction = true,
  actionColumnLabel = "Action",
}) => {
  const [page, setPage] = useState(1);

  // Sorting
  const [sortKey, setSortKey] = useState<string>(columns[0]?.key ?? "");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const total = data ? data.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const sortedData = React.useMemo(() => {
    if (!data) return [];
    const sortable = [...data];
    if (sortKey) {
      sortable.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDir === "asc" ? aValue - bValue : bValue - aValue;
        }
        return sortDir === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return sortable;
  }, [data, sortKey, sortDir]);

  const pagedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  // Keep page in range when totalPages changes
  useEffect(() => {
    setPage((p) => (p > totalPages ? totalPages : p < 1 ? 1 : p));
  }, [totalPages]);

  // Reset to page 1 when incoming data reference changes (e.g., new filter)
  useEffect(() => {
    setPage(1);
  }, [data]);

  if (loading) {
    return (
      <div className="w-full min-h-[180px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CBD5E1] border-r-blue-500" />
        <span className="ml-3 text-[#164E9D] font-inter font-semibold">Loading...</span>
      </div>
    );
  }

  if (error || (data && data.length === 0)) {
    return (
      <div className="w-full min-h-[180px] flex items-center justify-center text-[#EF4444] font-inter font-semibold">
        {error ? error : <EmptyDataValidation />}
      </div>
    );
  }

  const isLastRow = (idx: number) => idx === pagedData.length - 1;

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto font-inter">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className="py-5 px-3 text-center text-[15px] font-bold text-white bg-[#02214C] select-none"
                style={{
                  fontFamily: "Inter, Arial, Helvetica, sans-serif",
                  lineHeight: "19.2px",
                  fontWeight: 700,
                  borderTopLeftRadius: i === 0 ? 5 : 0,
                  borderTopRightRadius: i === columns.length - (showAction ? 0 : 1) ? 5 : 0,
                  cursor: col.sortable ? "pointer" : "default",
                }}
                onClick={() => {
                  if (!col.sortable) return;
                  setSortKey((prev) => {
                    if (prev === col.key) {
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                      return prev;
                    } else {
                      setSortDir("asc");
                      return col.key;
                    }
                  });
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{col.label}</span>
                  {col.sortable && (
                    <SortIcon active={sortKey === col.key} direction={sortKey === col.key ? sortDir : "asc"} />
                  )}
                </div>
              </th>
            ))}
            {showAction && (
              <th
                className="py-5 px-3 text-center text-[15px] font-bold text-white bg-[#02214C]"
                style={{
                  fontFamily: "Inter, Arial, Helvetica, sans-serif",
                  lineHeight: "19.2px",
                  fontWeight: 700,
                  borderTopRightRadius: 5,
                }}
              >
                {actionColumnLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {pagedData.map((row, idx) => (
            <tr
              key={idx}
              className={`${idx % 2 === 1 ? "bg-[#f1f5f9]" : "bg-white"}`}
              style={
                isLastRow(idx)
                  ? {
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }
                  : {}
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-3 py-5 text-[15px] text-[#363B3F] text-center font-medium align-middle"
                  style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? ""}
                </td>
              ))}
              {showAction && (
                <td className="px-3 py-5 text-center align-middle">
                  <Button variant="tertiary" size="table" onClick={() => onDetail && onDetail(row)}>
                    Detail
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Row */}
      <div className="flex flex-row justify-between items-center mt-4 px-1">
        <div className="text-xs text-[#637381] font-inter">
          Show {pagedData.length} from {total} data
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default Table;