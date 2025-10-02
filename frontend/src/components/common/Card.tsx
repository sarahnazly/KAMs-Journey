import React from "react";

interface CardProps {
  heading: string;
  description?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ heading, description, children }) => {
  return (
    <div className="w-full bg-[#FFFFFF] shadow-md border border-[#CBD5E1] rounded-[15px] flex flex-col">
      {/* Header Section */}
      <div className="w-full bg-[#F6FBFF] rounded-t-[15px] border-b border-[#CBD5E1]">
        <div className="flex flex-col px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] font-inter">
            {heading}
          </h2>
          {description && (
            <p className="mt-1 text-xs sm:text-sm md:text-base leading-relaxed font-normal text-[#94A3B8] font-inter">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-5 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-[#000000] font-inter">
        {children}
      </div>
    </div>
  );
};

export default Card;