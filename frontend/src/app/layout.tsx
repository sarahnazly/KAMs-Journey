import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "KAMs Journey",
  description: "Dashboard Analytics for AM Journey",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#F8FAFC] text-foreground`}>
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar />
        </header>
        <main className="min-h-screen w-full flex flex-col items-center justify-start">
          {children}
        </main>
      </body>
    </html>
  );
}