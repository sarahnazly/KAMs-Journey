"use client";

import React, { useState, useEffect, useRef } from "react";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

interface FilterQuarterProps {
  value: string;
  onChange?: (quarter: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const FilterQuarter: React.FC<FilterQuarterProps> = ({
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
      className={`relative w-[200px] flex flex-col gap-1 ${className}`} // Sesuaikan dengan lebar di page.tsx
      ref={wrapperRef}
      style={style}
    >
      <button
        className="w-full h-10 flex items-center justify-between px-3 bg-white rounded-[5px] border border-[#CBD5E1] outline-none font-inter text-[16px] font-semibold text-black leading-[24px] transition" // Tambahkan h-10, ubah py-2 menjadi px-3
        onClick={() => setOpen((v) => !v)}
        type="button"
        style={{ cursor: "pointer" }}
      >
        <span>{value}</span>
        <span>
          {/* Chevron Down SVG */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M5 8l5 5 5-5"
              stroke="#0E161C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-[4px] z-50 bg-white rounded-[5px] border border-[#CBD5E1] shadow-md flex flex-col w-full">
          {QUARTERS.map((quarter) => (
            <button
              key={quarter}
              type="button"
              onClick={() => {
                if (onChange) onChange(quarter);
                setOpen(false);
              }}
              className={`w-full text-left py-2 px-3 font-inter text-[16px] font-semibold leading-[24px] transition-colors ${
                quarter === value
                  ? "bg-[#E9F8FF] text-[#02214C]"
                  : "text-black"
              } hover:bg-[#E9F8FF] hover:text-[#164E9D]`}
              style={{ cursor: "pointer" }}
            >
              {quarter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterQuarter;