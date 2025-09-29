"use client";

import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "@/components/dashboard/Table";
import InfoAlert from "@/components/dashboard/InfoAlert";
import WarningAlert from "@/components/dashboard/WarningAlert";
import FilterYear from "@/components/dashboard/FilterYear";
import Toast, { ToastType } from "@/components/common/Toast";
import TabStage from "@/components/dashboard/TabStage";

export default function HomePage() {
  // Data dinamis
  const [data, setData] = useState<Record<string, any>[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Toast
  const [toast, setToast] = useState<{ open: boolean; title: string; message: string; type: ToastType }>({
    open: false, title: "", message: "", type: "success"
  });
  const showToast = (title: string, message: string, type: ToastType) =>
    setToast({ open: true, title, message, type });
  const closeToast = () => setToast({ ...toast, open: false });

  // Filter tahun
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // TabStage
  const [stage, setStage] = useState("Onboarding");
  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    showToast("Berhasil", `Pindah ke stage ${newStage}`, "success");
  };

  // Table columns dinamis
  const columns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Basic Understanding", key: "score1", sortable: true },
    { label: "Twinning", key: "score2", sortable: true },
    { label: "Customer Matching", key: "score3", sortable: true }
  ];

  // Simulasi ambil data
  useEffect(() => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (year === 2024) {
        setError("Gagal mengambil data untuk tahun 2024.");
        setData(null);
      } else if (year === 2023) {
        setData([]);
      } else {
        setData([
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86 },
        ]);
      }
      setLoading(false);
    }, 1200);
  }, [year, stage]);

  // Detail action
  const handleDetail = (row: Record<string, any>) => {
    showToast("Detail Karyawan", `Nama: ${row.nama}\nNIK: ${row.nik}`, "info");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-start pt-8 gap-6">
      {/* Filter Year di kanan atas */}
      <div className="w-full flex justify-end mb-2 px-[80px]">
        <FilterYear onChange={setYear} />
      </div>

      {/* Info & warning alert */}
      <div className="max-w-[1100px] w-full flex flex-col items-center gap-4">
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
      </div>

      {/* TabStage align center */}
      <div className="w-full flex items-center justify-center mb-4">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Table align center */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <Table
            columns={columns}
            data={data}
            loading={loading}
            error={error}
            pageSize={4}
            onDetail={handleDetail}
            showAction={true}
          />
        </div>
      </div>

      {/* Toast di pojok kanan bawah */}
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