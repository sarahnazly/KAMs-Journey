"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Upload File", href: "/upload" },
    { name: "AM Journey", href: "/journey" },
  ];

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `ml-6 font-medium transition-colors ${
      isActive
        ? "text-[#02214C]"
        : "text-[#64748b] hover:text-[#164E9D]"
    }`;
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <span className="text-gray-300 text-xl">|</span>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-[#02214C]">
              KAMs Journey
            </span>
            <span className="text-sm text-gray-500">
              Dashboard Analytics
            </span>
          </div>
        </div>

        {/* Right: Menu */}
        <div className="flex items-center">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClass(item.href)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
