import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-[90px] border-b-[1.5px] border-[#CBD5E1] bg-white flex items-center font-sans">
      {/* Section kiri */}
      <div className="flex items-center h-full pl-5" style={{ paddingLeft: 20 }}>
        <div className="flex flex-row items-center gap-[10px]">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-[14.87px] object-cover"
            priority
          />
          {/* Garis vertikal */}
          <div className="h-[44px] w-[2px] bg-[#94A3B8]" />
          {/* Title */}
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[22px] leading-[28px] text-[#0F172A] w-[180px]">
              KAMs Journey
            </span>
            <span className="text-[13px] font-normal leading-5 text-[#64748B] w-[180px]">
              Dashboard Analytics
            </span>
          </div>
        </div>
      </div>
      {/* Spacer agar kanan di kanan */}
      <div className="flex-1"></div>
      {/* Section kanan */}
      <div
        className="flex flex-row gap-8 pr-5 h-full items-center"
        style={{ paddingRight: 20 }}
      >
        <button
          className="text-center text-[17px] font-medium leading-[26px] text-[#02214C] hover:text-[#164E9D] transition-colors duration-150 bg-transparent border-none outline-none cursor-pointer whitespace-nowrap"
          style={{ background: "none" }}
        >
          Upload File
        </button>
        <button
          className="text-center text-[17px] font-normal leading-[26px] text-[#64748B] hover:text-[#164E9D] transition-colors duration-150 bg-transparent border-none outline-none cursor-pointer whitespace-nowrap"
          style={{ background: "none" }}
        >
          AM Journey
        </button>
      </div>
    </nav>
  );
}