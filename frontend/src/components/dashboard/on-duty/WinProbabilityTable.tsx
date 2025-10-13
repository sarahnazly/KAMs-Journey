"use client";

import React, { useState, useMemo } from "react";

export type WinProbabilityTableColumn = {
  label: string;
  key: string;
  sortable?: boolean;
};

interface WinProbabilityTableProps {
  columns: WinProbabilityTableColumn[];
  data: Record<string, any>[];
  loading?: boolean;
}

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
      {direction === "asc" ? (
        <path d="M8 6L11 9H5L8 6Z" fill={active ? "#fff" : "rgba(255,255,255,0.5)"} />
      ) : (
        <path d="M8 10L5 7H11L8 10Z" fill={active ? "#fff" : "rgba(255,255,255,0.5)"} />
      )}
    </svg>
  );
}

export const WinProbabilityTable: React.FC<WinProbabilityTableProps> = ({
  columns,
  data,
  loading = false,
}) => {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    
    const sortable = [...data];
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
    
    return sortable;
  }, [data, sortKey, sortDir]);

  if (loading) {
    return (
      <div className="w-full min-h-[120px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#CBD5E1] border-r-blue-500" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full min-h-[120px] flex items-center justify-center text-[#64748B] text-sm font-inter">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* Table Header */}
        <div className="flex px-2.5 py-3 bg-[#16396E] rounded-t-[5px]">
          {columns.map((col) => (
            <div
              key={col.key}
              className={`flex-1 flex justify-center items-center gap-1 ${
                col.sortable ? "cursor-pointer select-none" : ""
              }`}
              onClick={() => {
                if (!col.sortable) return;
                if (sortKey === col.key) {
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                } else {
                  setSortKey(col.key);
                  setSortDir("asc");
                }
              }}
            >
              <span className="text-white text-sm font-inter font-bold leading-snug">
                {col.label}
              </span>
              {col.sortable && (
                <SortIcon
                  active={sortKey === col.key}
                  direction={sortKey === col.key ? sortDir : "asc"}
                />
              )}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {sortedData.map((row, idx) => (
          <div
            key={idx}
            className={`flex px-2.5 py-2.5 ${
              idx % 2 === 0 ? "bg-[#F8FAFC]" : "bg-[#F1F5F9]"
            } ${
              idx === sortedData.length - 1 ? "rounded-b-[5px]" : ""
            } border-b border-[#CBD5E1]`}
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex-1 text-center text-[#363B3F] text-xs font-inter font-medium leading-snug"
              >
                {row[col.key] ?? "-"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinProbabilityTable;