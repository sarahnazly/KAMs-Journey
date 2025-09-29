"use client";

import React, { useState } from "react";
import InfoAlert from "@/components/dashboard/InfoAlert";
import TabStage from "../components/dashboard/TabStage";
import WarningAlert from "@/components/dashboard/WarningAlert";
import FilterYear from "@/components/dashboard/FilterYear";
import Toast, { ToastType } from "@/components/common/Toast";

export default function HomePage() {
  const [stage, setStage] = useState("Onboarding");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [toast, setToast] = useState<{ open: boolean; title: string; message: string; type: ToastType }>({
    open: false, title: "", message: "", type: "success"
  });
  const showToast = (title: string, message: string, type: ToastType) =>
    setToast({ open: true, title, message, type });
  const closeToast = () => setToast({ ...toast, open: false });

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

  // Contoh: trigger toast saat ganti stage
  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    showToast("Berhasil", `Pindah ke stage ${newStage}`, "success");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] gap-6 pt-8 flex flex-col items-center justify-center">
      <div className="w-full flex justify-end mb-2 px-[80px]">
        <FilterYear onChange={setYear} />
      </div>

      <div className="flex flex-row gap-3 mb-8">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded font-semibold"
          onClick={() =>
            showToast("Aksi berhasil!", "Data berhasil disimpan!", "success")
          }
        >
          Demo Success Toast
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
          onClick={() =>
            showToast("Aksi gagal!", "Terjadi kesalahan pada server. Silakan coba lagi.", "error")
          }
        >
          Demo Error Toast
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded font-semibold"
          onClick={() =>
            showToast("Info!", "Perlu informasi tambahan sebelum melanjutkan.", "info")
          }
        >
          Demo Info Toast
        </button>
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
      <TabStage onStageChange={handleStageChange} />
      <div className="mt-10 w-[800px] h-[260px] bg-white rounded-2xl flex items-center justify-center border border-[#e5e7eb] shadow">
        <span className="text-xl font-inter text-[#164E9D]">{getStageContent(stage, year)}</span>
      </div>
      {Toast({
        open: toast.open,
        title: toast.title,
        message: toast.message,
        type: toast.type,
        onClose: closeToast
      })}
    </div>
  );
}