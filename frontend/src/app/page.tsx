"use client";

import TabStage from "../components/dashboard/TabStage";
import React, { useState } from "react";

export default function HomePage() {
  const [stage, setStage] = useState("Onboarding");

  // Simulasi data dashboard/tabel berubah sesuai stage
  const getStageContent = (stage: string) => {
    switch (stage) {
      case "Onboarding":
        return "Data Onboarding";
      case "On Duty":
        return "Data On Duty";
      case "Performance":
        return "Data Performance";
      case "Evaluation":
        return "Data Evaluation";
      case "Development":
        return "Data Development";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center">
      <TabStage onStageChange={setStage} />
      <div className="mt-10 w-[800px] h-[260px] bg-white rounded-2xl flex items-center justify-center border border-[#e5e7eb] shadow">
        <span className="text-xl font-inter text-[#164E9D]">{getStageContent(stage)}</span>
      </div>
    </div>
  );
}