"use client";

import InfoAlert from "@/components/dashboard/InfoAlert";
import TabStage from "../components/dashboard/TabStage";
import React, { useState } from "react";
import WarningAlert from "@/components/dashboard/WarningAlert";

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
    <div className="min-h-screen w-full bg-[#F8FAFC] gap-6 pt-8 flex flex-col items-center justify-center">
      <InfoAlert
        message={
          <>
            This prediction uses <span className="font-bold">XGBoost</span> algorithm with <span className="font-bold">85% accuracy rate</span>. The model was trained using <span className="font-bold">500 data</span>.
          </>
        }
      />
      <WarningAlert
        message="Input dokumen tidak konsisten. Silakan cek kembali data Anda sebelum melanjutkan."
      />
      <TabStage onStageChange={setStage} />
      <div className="mt-10 w-[800px] h-[260px] bg-white rounded-2xl flex items-center justify-center border border-[#e5e7eb] shadow">
        <span className="text-xl font-inter text-[#164E9D]">{getStageContent(stage)}</span>
      </div>
    </div>
  );
}