import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"], weight: ["600"] });

const Footer = () => {
  return (
    <footer className="w-full px-10 py-6 bg-white border-t border-slate-300 flex flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Account Executive Journey Logo" width={44} height={44} />
          <span className={`${inter.className} font-semibold text-[15.24px] leading-[18.29px] text-[#0F172A]`}>
            Account Executive Journey
          </span>
        </div>
        <div className="mx-4 h-6 w-px bg-slate-300 rotate-0" />
        <div className="flex items-center gap-1 text-[#64748B]">
          <Image src="/assets/Copyright.svg" alt="Copyright" width={12} height={12} />
          <span className={`${inter.className} font-semibold text-[10px] leading-[15px] text-[#64748B]`}>
            2025 Account Executive Journey. All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;