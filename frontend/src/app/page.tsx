"use client";

import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "@/components/dashboard/Table";
import InfoAlert from "@/components/dashboard/InfoAlert";
import WarningAlert from "@/components/dashboard/WarningAlert";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
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

  // Filter quarter
  const [quarter, setQuarter] = useState<string>("Q1");

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
        setError(`Gagal mengambil data untuk periode ${quarter} tahun ${year}.`);
        setData(null);
      } else if (year === 2023) {
        setData([]);
      } else {
        const allData = [
          { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86, quarter: "Q1" },
          { nik: "20920", nama: "Budi Santoso", score1: 85, score2: 75, score3: 81, quarter: "Q2" },
          { nik: "20921", nama: "Nicholas Saputra", score1: 92, score2: 82, score3: 90, quarter: "Q3" },
          { nik: "20922", nama: "Pinky Siwi Nastiti", score1: 88, score2: 78, score3: 85, quarter: "Q4" },
          // duplikasi untuk demo (filter akan pilih sesuai quarter)
          { nik: "20923", nama: "Anindya Maulida Widyatmoko", score1: 90, score2: 80, score3: 86, quarter: "Q1" },
          { nik: "20924", nama: "Sarah Nazly Nuraya", score1: 85, score2: 75, score3: 81, quarter: "Q2" },
          { nik: "20925", nama: "Celina", score1: 92, score2: 82, score3: 90, quarter: "Q3" },
          { nik: "20926", nama: "Alya Ghina", score1: 88, score2: 78, score3: 85, quarter: "Q4" },
        ];
        // Filter berdasarkan quarter yang dipilih
        const filteredData = allData.filter((row) => row.quarter === quarter);
        setData(filteredData);
      }
      setLoading(false);
    }, 1200);
  }, [year, quarter, stage]);

  // Detail action
  const handleDetail = (row: Record<string, any>) => {
    showToast("Detail Karyawan", `Nama: ${row.nama}\nNIK: ${row.nik}`, "info");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-start pt-8 gap-6">
      {/* Filter Quarter and Year */}
      <div className="w-full flex justify-end mb-2 px-[80px]">
        <div className="flex flex-row gap-4">
          <FilterQuarter onChange={setQuarter} />
          <FilterYear onChange={setYear} />
        </div>
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