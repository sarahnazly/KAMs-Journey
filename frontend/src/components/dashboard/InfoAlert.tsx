import React from "react";

interface InfoAlertProps {
  title?: string;
  message: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const InfoAlert: React.FC<InfoAlertProps> = ({
  title = "Model Information",
  message,
  className = "",
  style = {},
}) => (
  <div
    className={`w-full max-w-[900px] flex flex-col justify-start items-start gap-[10px] px-[35px] py-[20px] rounded-[8px] border-l-[6px] border-[var(--Primary-Navy,#16396E)] bg-[#E9F3FF] ${className}`}
    style={style}
  >
    <div className="flex flex-row items-start gap-[22px] w-full">
      {/* Info Icon: circle with "i" */}
      <div className="flex items-center justify-center w-[34px] h-[34px] bg-[var(--Primary-Navy,#16396E)] rounded-[6px]">
        <svg width="22" height="22" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="10" fill="#fff" />
          <text x="11" y="16" textAnchor="middle" fill="#16396E" fontSize="16" fontWeight="bold" fontFamily="Inter, Arial, Helvetica, sans-serif">i</text>
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-[14px] min-w-0">
        <div
          className="text-[18px] font-semibold leading-[26px] text-[var(--Primary-Navy,#16396E)] font-inter text-left"
          style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
        >
          {title}
        </div>
        <div className="text-[16px] leading-[24px] text-[#637381] font-inter font-normal break-words">
          {message}
        </div>
      </div>
    </div>
  </div>
);

export default InfoAlert;