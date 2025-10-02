"use client";

import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "@/components/dashboard/Table";
import InfoAlert from "@/components/dashboard/InfoAlert";
import WarningAlert from "@/components/dashboard/WarningAlert";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import SearchBar from "@/components/dashboard/SearchBar";
import Toast, { ToastType } from "@/components/common/Toast";
import TabStage from "@/components/dashboard/TabStage";
import { Button } from "@/components/common/Button";
import { Inter } from "next/font/google";
import { Upload, ArrowRight } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

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

  // Search Bar
  const [search, setSearch] = useState("");

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
        setLoading(false);
        return;
      } 
      if (year === 2023) {
        setData([]);
        setLoading(false);
        return;
      }
      const allData = [
        { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86, quarter: "Q1" },
        { nik: "20920", nama: "Budi Santoso", score1: 85, score2: 75, score3: 81, quarter: "Q2" },
        { nik: "20921", nama: "Nicholas Saputra", score1: 92, score2: 82, score3: 90, quarter: "Q3" },
        { nik: "20922", nama: "Pinky Siwi Nastiti", score1: 88, score2: 78, score3: 85, quarter: "Q4" },
        { nik: "20923", nama: "Anindya Maulida Widyatmoko", score1: 90, score2: 80, score3: 86, quarter: "Q1" },
        { nik: "20924", nama: "Sarah Nazly Nuraya", score1: 85, score2: 75, score3: 81, quarter: "Q2" },
        { nik: "20925", nama: "Celina", score1: 92, score2: 82, score3: 90, quarter: "Q3" },
        { nik: "20926", nama: "Alya Ghina", score1: 88, score2: 78, score3: 85, quarter: "Q4" },
      ];
      let filtered = allData.filter((row) => row.quarter === quarter);
      if (search) {
        filtered = filtered.filter(
          row =>
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.nik.includes(search)
        );
      }
      setData(filtered);
      setLoading(false);
    }, 1200);
  }, [year, quarter, stage, search]);

  // Detail action
  const handleDetail = (row: Record<string, any>) => {
    showToast("Detail Karyawan", `Nama: ${row.nama}\nNIK: ${row.nik}`, "info");
  };

  // Button click handler for demo
  const handleButtonClick = (type: string) => {
    showToast("Button Clicked", `You clicked the ${type} button!`, "success");
  };

  return (
    <div className={`min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-start pt-8 gap-6 ${inter.className}`}>
      {/* SearchBar, Year, and Quarter Filter Card */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]" style={{ outlineOffset: -1 }}>
          <div className="flex-1 flex flex-col items-start">
            <div className="w-full text-black text-[20px] font-semibold leading-[30px]">Search KAMs</div>
            <SearchBar value={search} onChange={setSearch} className="w-full" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-[200px]">
              <div className="text-black text-[20px] font-semibold leading-[24px]">Tahun</div>
              <div className="w-full flex items-center justify-between gap-[72px] bg-white rounded-[5px] border-[#CBD5E1] mt-1">
                <FilterYear value={year} onChange={setYear} />
              </div>
            </div>
            <div className="w-[200px]">
              <div className="text-black text-[20px] font-semibold leading-[24px]">Periode</div>
              <div className="w-full flex items-center justify-between gap-[72px] bg-white rounded-[5px] border-[#CBD5E1] mt-1">
                <FilterQuarter value={quarter} onChange={setQuarter} />
              </div>
            </div>
          </div>
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

      {/* Button Demo Section */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full flex flex-col gap-6">
          <h2 className="text-black text-[24px] font-semibold leading-[30px]">Button Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="primary" onClick={() => handleButtonClick("Primary")}>
              <Upload size={20} />
              Upload
            </Button>
            <Button variant="secondary" onClick={() => handleButtonClick("Secondary")}>
              Start Processing
              <ArrowRight size={20} />
            </Button>
            <Button variant="tertiary" onClick={() => handleButtonClick("Tertiary")}>
              <Upload size={20} />
              Button
            </Button>
            <Button variant="destructive" onClick={() => handleButtonClick("Delete")}>
              Retry
              <ArrowRight size={20} />
            </Button>
            <Button variant="ghost" onClick={() => handleButtonClick("Ghost")}>
              <Upload size={20} />
              Cancel
            </Button>
          </div>
        </div>
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