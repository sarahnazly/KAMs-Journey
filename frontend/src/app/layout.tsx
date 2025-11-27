"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isJourney = pathname?.startsWith("/journey");
  const isInput = pathname?.startsWith("/input");

  // Kelas button kanan (hover dan active meniru navbar.tsx)
  const rightBtnBase =
    "text-center text-[15px] leading-[26px] transition-colors duration-150 bg-transparent border-none outline-none cursor-pointer whitespace-nowrap";
  const inputBtnClass = `${rightBtnBase} ${
    isInput ? "text-[#02214C] font-medium" : "text-[#64748B] font-normal"
  } hover:text-[#164E9D]`;
  const journeyBtnClass = `${rightBtnBase} ${
    isJourney ? "text-[#02214C] font-medium" : "text-[#64748B] font-normal"
  } hover:text-[#164E9D]`;

  return (
    <html lang="en" className={inter.variable}>
      <body className={`bg-[#F8FAFC] min-h-screen flex flex-col ${inter.className}`}>
        {/* Navbar: gaya meniru components/navbar.tsx */}
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
                <span className="font-bold text-[22px] leading-[28px] text-[#0F172A] w-[360px]">
                  Account Executive Journey
                </span>
                <span className="text-[13px] font-normal leading-5 text-[#64748B] w-[180px]">
                  Dashboard Analytics
                </span>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Section kanan */}
          <div className="flex flex-row gap-8 pr-5 h-full items-center" style={{ paddingRight: 20 }}>
            <Link href="/input/upload-file" className={inputBtnClass}>
              Input Data
            </Link>
            <Link href="/journey/orientasi" className={journeyBtnClass}>
              AE Journey
            </Link>
          </div>
        </nav>

        {/* Halaman */}
        <div className="flex-1">{children}</div>

        {/* Footer: gaya meniru components/footer.tsx */}
        <footer className="w-full px-10 py-6 bg-white border-t border-slate-300 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Account Executive Journey Logo" width={44} height={44} />
              <span className="font-semibold text-[15.24px] leading-[18.29px] text-[#0F172A]">
                Account Executive Journey
              </span>
            </div>
            <div className="mx-4 h-6 w-px bg-slate-300 rotate-0" />
            <div className="flex items-center gap-1 text-[#64748B]">
              <Image src="/assets/Copyright.svg" alt="Copyright" width={12} height={12} />
              <span className="font-semibold text-[10px] leading-[15px] text-[#64748B]">
                {new Date().getFullYear()} Account Executive Journey. All rights reserved
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}