"use client";

import React, { useState, useEffect, useRef } from "react";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

interface FilterQuarterProps {
  onChange?: (quarter: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const getCurrentQuarter = () => {
  const now = new Date();
  const month = now.getMonth();
  if (month < 3) return "Q1";
  if (month < 6) return "Q2";
  if (month < 9) return "Q3";
  return "Q4";
};

const FilterQuarter: React.FC<FilterQuarterProps> = ({
  onChange,
  className = "",
  style = {},
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<string>(getCurrentQuarter());
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onChange) onChange(selectedQuarter);
  }, [selectedQuarter, onChange]);

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
      className={`relative w-[160px] flex flex-col gap-2 ${className}`}
      ref={wrapperRef}
      style={style}
    >
      <div 
        className="text-black text-[20px] font-semibold font-inter leading-[30px] mb-1"
      >
        Periode
      </div>
      <button
        className="w-full flex items-center justify-between py-2 px-3 bg-white rounded-[5px] border border-[#CBD5E1] outline-none font-inter text-[16px] font-semibold text-black leading-[24px] transition"
        onClick={() => setOpen((v) => !v)}
        type="button"
        style={{cursor:"pointer"}}
      >
        <span>{selectedQuarter}</span>
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
                setSelectedQuarter(quarter);
                setOpen(false);
              }}
              className={`w-full text-left py-2 px-3 font-inter text-[16px] font-semibold leading-[24px] transition-colors ${
                quarter === selectedQuarter
                  ? "bg-[#E9F8FF] text-[#02214C]"
                  : "text-black"
              } hover:bg-[#E9F8FF] hover:text-[#164E9D]`}
              style={{
                cursor: "pointer",
              }}
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