"use client";

import React, { useState, useEffect, useRef } from "react";

const EVALUATION_CATEGORIES = [
  "All",
  "Melanjutkan",
  "Perlu Pengembangan Kompetensi",
  "SP 1",
  "SP 2",
  "SP 3",
  "Diberhentikan",
];

interface FilterEvaluationCategoryProps {
  value: string;
  onChange?: (category: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const FilterEvaluationCategory: React.FC<FilterEvaluationCategoryProps> = ({
  value,
  onChange,
  className = "",
  style = {},
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative w-[240px] flex flex-col gap-1 ${className}`}
      ref={wrapperRef}
      style={style}
    >
      <button
        className="w-full h-9 flex items-center justify-between px-3 bg-white rounded-[5px] border border-[#CBD5E1] outline-none font-inter text-sm font-medium text-[#0F172A] leading-tight transition hover:border-[#02214C]"
        onClick={() => setOpen((v) => !v)}
        type="button"
        style={{ cursor: "pointer" }}
      >
        <span className="truncate text-left">{value}</span>
        <span className="ml-2 flex-shrink-0">
          {/* Chevron Down SVG */}
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path
              d="M4 6l4 4 4-4"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-[5px] border border-[#CBD5E1] shadow-lg flex flex-col w-full max-h-[260px] overflow-y-auto">
          {EVALUATION_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                if (onChange) onChange(category);
                setOpen(false);
              }}
              className={`w-full text-left py-2 px-3 font-inter text-sm font-medium leading-snug transition-colors ${
                category === value
                  ? "bg-[#E9F8FF] text-[#02214C]"
                  : "text-[#0F172A]"
              } hover:bg-[#E9F8FF] hover:text-[#02214C]`}
              style={{ cursor: "pointer" }}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterEvaluationCategory;