import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full px-10 py-6 bg-white border-t border-slate-300 flex flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="KAMs Journey Logo"
            width={44}
            height={44}
          />
          <span
            style={{
              color: "#0F172A",
              fontSize: 15.24,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              lineHeight: "18.29px",
              wordWrap: "break-word",
            }}
          >
            KAMs Journey
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4 h-6 w-px bg-slate-300 rotate-0" />

        {/* Copyright */}
        <div className="flex items-center gap-1" style={{ color: "#64748B" }}>
          <Image
            src="/assets/Copyright.svg"
            alt="Copyright"
            width={12}
            height={12}
          />
          <span
            style={{
              color: "#64748B",
              fontSize: 10,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              lineHeight: "15px",
              wordWrap: "break-word",
            }}
          >
            2025 KAMs Journey. All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;