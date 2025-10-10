import React from "react";

export interface CardProps {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function Card({
  heading,
  description,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: CardProps) {
  return (
    <div className={`bg-white rounded-[12px] border border-[#CBD5E1] shadow-[0_4px_10px_rgba(0,0,0,0.10)] p-6 ${className}`}>
      {(heading || description) && (
        <div className={`-mx-6 -mt-6 px-6 py-4 bg-[#F6FBFF] border-b border-[#CBD5E1] rounded-t-[12px] ${headerClassName}`}>
          {typeof heading === "string" || typeof description === "string" ? (
            <div>
              {heading && <div className="text-[#0F172A] text-[20px] md:text-[22px] font-bold">{heading}</div>}
              {description && <div className="text-[#94A3B8] text-[14px] md:text-[16px]">{description}</div>}
            </div>
          ) : (
            heading
          )}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
}