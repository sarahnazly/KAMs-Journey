"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const stages = [
  "Onboarding",
  "On Duty",
  "Performance",
  "Evaluation",
  "Development",
] as const;

type Stage = typeof stages[number];

interface TabStageProps {
  onStageChange?: (stage: Stage) => void;
  width?: string;
  height?: string;
  defaultStage?: Stage;
}

function deriveStageFromPath(pathname?: string): Stage {
  const p = pathname || "";
  if (p.startsWith("/journey/performance")) return "Performance";
  if (p.startsWith("/journey/on-duty")) return "On Duty";
  if (p.startsWith("/journey/evaluation")) return "Evaluation";
  if (p.startsWith("/journey/development")) return "Development";
  return "Onboarding";
}

const TabStage: React.FC<TabStageProps> = ({ onStageChange, width = "1200px", height = "85px", defaultStage }) => {
  const pathname = usePathname();

  // Inisialisasi dari defaultStage kalau ada; kalau tidak, deteksi dari path
  const initialActive = useMemo<Stage>(
    () => (defaultStage ? defaultStage : deriveStageFromPath(pathname)),
    [defaultStage, pathname]
  );

  const [activeStage, setActiveStage] = useState<Stage>(initialActive);

  // Sync ulang kalau URL berubah atau defaultStage berganti
  useEffect(() => {
    setActiveStage(initialActive);
  }, [initialActive]);

  const handleClick = (stage: Stage) => {
    setActiveStage(stage);
    onStageChange?.(stage);
  };

  return (
    <div className="w-full flex justify-center items-center mx-[50px]">
      <div
        className="
          w-full
          bg-white
          rounded-[20px]
          outline outline-[#E2E8F0]
          outline-offset-[-1px]
          shadow-[0_4px_16px_0_rgba(0,0,0,0.10)]
          flex items-center
        "
        style={{ width, height }}
      >
        <div className="flex w-full px-4 py-20 gap-[20px] justify-center items-center">
          {stages.map((stage) => (
            <button
              key={stage}
              type="button"
              data-state={activeStage === stage ? "Selected" : "Unselected"}
              onClick={() => handleClick(stage)}
              className={`
                flex-1 flex items-center justify-center
                rounded-[18px] font-inter font-semibold text-[16px] leading-[20px]
                transition-colors
                ${activeStage === stage ? "bg-[#02214C] text-white" : "bg-transparent text-[#0F172A] hover:bg-[#F0FAFF] hover:text-[#164E9D]"}
              `}
              style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif", fontWeight: 600, height: "60px" }}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabStage;