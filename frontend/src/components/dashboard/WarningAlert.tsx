import React from "react";

interface WarningAlertProps {
  title?: string;
  message: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const WarningAlert: React.FC<WarningAlertProps> = ({
  title = "Attention needed",
  message,
  className = "",
  style = {},
}) => (
  <div
    className={`w-full max-w-[900px] flex flex-col justify-start items-start gap-[10px] px-[35px] py-[20px] rounded-[8px] border-l-[6px] border-[#F87E0D] bg-[#FFFBEB] ${className}`}
    style={style}
  >
    <div className="flex flex-row items-start gap-[22px] w-full">
      {/* Warning Icon: triangle with "!" */}
      <div className="flex items-center justify-center w-[34px] h-[34px] bg-[#F87E0D] rounded-[6px]">
        <svg width="22" height="22" viewBox="0 0 34 34" fill="none">
            <polygon points="17,6 29,28 5,28" fill="#fff" />
            <rect x="16" y="13" width="2" height="8" rx="1" fill="#F87E0D" />
            <circle cx="17" cy="24" r="1.5" fill="#F87E0D" />
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-[14px] min-w-0">
        <div
          className="text-[18px] font-semibold leading-[26px] text-[#9D5425] font-inter text-left"
          style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
        >
          {title}
        </div>
        <div className="text-[16px] leading-[24px] text-[#D0915C] font-inter font-normal break-words">
          {message}
        </div>
      </div>
    </div>
  </div>
);

export default WarningAlert;