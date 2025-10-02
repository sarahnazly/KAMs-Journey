import React from "react";
import Image from "next/image";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className = "" }) => (
  <div className={`flex-1 flex flex-col justify-end items-start ${className}`}>
    <div className="w-full h-10 flex flex-row items-center gap-2 px-[15px] bg-white rounded-[5px] border border-[#CBD5E1]">
      <Image src="/assets/MagnifyingGlass.svg" alt="Magnifier" width={20} height={20} />
      <input
        className="flex-1 outline-none border-none bg-transparent text-[#64748B] text-[16px] font-normal leading-[24px] placeholder-[#64748B]"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by Name or NIK"
      />
    </div>
  </div>
);

export default SearchBar;