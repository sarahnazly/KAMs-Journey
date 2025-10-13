import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`bg-[#EFF6FF] border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-2 ${className} shadow-[0_4px_10px_rgba(0,0,0,0.10)]`}
      style={style}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <div className="text-[#64748B] text-sm font-inter font-medium leading-snug">
        {label}
      </div>
      <div className="text-[#02214C] text-3xl font-inter font-bold leading-tight">
        {value}
      </div>
    </div>
  );
};

export default MetricCard;