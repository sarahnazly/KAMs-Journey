import React from "react";

interface CardProps {
  heading: string;
  description?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ heading, description, children }) => {
  return (
    <div className="w-full pb-8 bg-[#FFFFFF] shadow-md border border-[#CBD5E1] rounded-[15px] flex flex-col items-center gap-7">
      {/* Header Section */}
      <div className="w-full px-8 py-5 bg-[#F6FBFF] rounded-t-[15px] border-b border-[#CBD5E1]">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-[#0F172A] font-inter">
            {heading}
          </h2>
          {description && (
            <p className="text-sm leading-[30px] font-normal text-[#94A3B8] font-inter">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="text-[16px] leading-[19.2px] font-bold text-[#000000] font-inter">
        {children}
      </div>
    </div>
  );
};

export default Card;