"use client";

import InfoAlert from "@/components/dashboard/InfoAlert";
import TabStage from "../components/dashboard/TabStage";
import React, { useState } from "react";
import WarningAlert from "@/components/dashboard/WarningAlert";
import FilterYear from "@/components/dashboard/FilterYear";

export default function HomePage() {
  const [stage, setStage] = useState("Onboarding");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Simulasi data dashboard/tabel berubah sesuai stage dan tahun
  const getStageContent = (stage: string, year: number) => {
    switch (stage) {
      case "Onboarding":
        return `Data Onboarding Tahun ${year}`;
      case "On Duty":
        return `Data On Duty Tahun ${year}`;
      case "Performance":
        return `Data Performance Tahun ${year}`;
      case "Evaluation":
        return `Data Evaluation Tahun ${year}`;
      case "Development":
        return `Data Development Tahun ${year}`;
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] gap-6 pt-8 flex flex-col items-center justify-center">
      <div className="w-full flex justify-end mb-2 px-[80px]">
        <FilterYear onChange={setYear} />
      </div>
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
        <span className="text-xl font-inter text-[#164E9D]">{getStageContent(stage, year)}</span>
      </div>
    </div>
  );
}