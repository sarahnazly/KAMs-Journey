"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/dashboard/SearchBar";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import TabStage from "@/components/dashboard/TabStage";
import Card from "@/components/common/Card";
import Table, { TableColumn } from "@/components/dashboard/Table";
import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

type informalRow = {
  nik: string;
  name: string;
  informalCoaching: "F0" | "F1" | "F2" | "F3" | "F4" | "F5";
  informalLesson: string;
  year: number;
  quarter: Quarter;
};

type formalRow = {
  nik: string;
  name: string;
  courseName: string;
  certificateId: string;
  formalCoaching: "F0" | "F1" | "F2" | "F3" | "F4" | "F5";
  formalLesson: string;
  year: number;
  quarter: Quarter;
};

const stageToPath = (stage: string) => {
  switch (stage) {
    case "Orientasi":
      return "/journey/orientasi";
    case "Pelaksanaan":
      return "/journey/pelaksanaan";
    case "Kinerja":
      return "/journey/kinerja";
    case "Evaluasi":
      return "/journey/evaluasi";
    case "Pengembangan":
      return "/journey/pengembangan";
    default:
      return "/journey/pengembangan";
  }
};

// Mock informal learning data (ganti ke fetch API nanti)
const informalData: informalRow[] = [
  {
    nik: "20919",
    name: "Ratu Nadya Anjania",
    informalCoaching: "F1",
    informalLesson: "perlu perbaikan dokumentasi",
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20971",
    name: "Sarah Nazly Nuraya",
    informalCoaching: "F2",
    informalLesson: "penerapan meningkatkan demo POC",
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20984",
    name: "Anindya Maulida Widyatmoko",
    informalCoaching: "F0",
    informalLesson: "improve komunikasi",
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20992",
    name: "John Doe",
    informalCoaching: "F2",
    informalLesson: "improve komunikasi",
    year: 2025,
    quarter: "Q1",
  },
];

// Mock formal learning data (ganti ke fetch API nanti)
const formalData: formalRow[] = [
  {
    nik: "20919",
    name: "Ratu Nadya Anjania",
    courseName: "INTRODUCTION TO CYBER",
    certificateId: "290-029ID201",
    formalCoaching: "F4",
    formalLesson: "course meningkatkan skill bidding",
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20971",
    name: "Sarah Nazly Nuraya",
    courseName: "PMP CERTIFICATION",
    certificateId: "PM3810-01",
    formalCoaching: "F5",
    formalLesson: "course membantu memetakan project opportunities untuk pelanggan",
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20984",
    name: "Anindya Maulida Widyatmoko",
    courseName: "SALES ADVANCE",
    certificateId: "9201SA2010",
    formalCoaching: "F3",
    formalLesson: "course meningkatkan skill bidding",
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20992",
    name: "John Doe",
    courseName: "CLOUD COMPUTING",
    certificateId: "CC2910-020",
    formalCoaching: "F2",
    formalLesson: "course kurang terkait praktik lapangan",
    year: 2025,
    quarter: "Q1",
  },
];

export default function PengembanganPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number>(2025);
  const [quarter, setQuarter] = useState<Quarter>("Q1");

  // Loading + error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Table data
  const [informalRows, setInformalRows] = useState<informalRow[]>([]);
  const [formalRows, setFormalRows] = useState<formalRow[]>([]);
  const pageSize = 10;

  const handleStageChange = (stage: string) => {
    router.push(stageToPath(stage));
  };

  // Load data (simulate fetch)
  useEffect(() => {
    const shouldFail = searchParams.get("fail") === "1";
    setLoading(true);
    setError("");
    const t = setTimeout(() => {
      try {
        if (shouldFail) throw new Error("Gagal mengambil data dari server. Coba lagi nanti.");

        let filteredInformal = informalData.filter(
          (r) => r.year === year && r.quarter === quarter
        );
        let filteredFormal = formalData.filter(
          (r) => r.year === year && r.quarter === quarter
        );

        if (search.trim()) {
          const q = search.toLowerCase();
          filteredInformal = filteredInformal.filter(
            (r) => 
              r.nik.includes(search) || 
            r.name.toLowerCase().includes(q)
          );
          filteredFormal = filteredFormal.filter(
            (r) => 
              r.nik.includes(search) ||
            r.name.toLowerCase().includes(q)
          );
        }

        setInformalRows(filteredInformal);
        setFormalRows(filteredFormal);
      } catch (e: any) {
        setError(e?.message || "Terjadi kesalahan tak terduga.");
        setInformalRows([]);
        setFormalRows([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [search, year, quarter, searchParams]);

  const informalCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Name", key: "name", sortable: true },
      { label: "Hasil Coaching", key: "informalCoaching", sortable: true },
      { label: "Lesson Learned", key: "informalLesson", sortable: true },
    ],
    []
  );

  const formalCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Name", key: "name", sortable: true },
      { label: "Course Name", key: "courseName", sortable: true },
      { label: "Certificate ID", key: "certificateId", sortable: true },
      { label: "Hasil Coaching", key: "formalCoaching", sortable: true },
      { label: "Lesson Learned", key: "formalLesson", sortable: true },
    ],
    []
  );

  // Feature Importance data
  const features: Feature[] = useMemo(
    () => [
      { name: "Revenue Sales Ach.",       importance: 0.20, description: "Capaian revenue terhadap target penjualan." },
      { name: "AE Tools Ach.",            importance: 0.16, description: "Tingkat ketercapaian target pemanfaatan tools AE." },
      { name: "Profitability Ach.",       importance: 0.14, description: "Kontribusi margin/laba terhadap target." },
      { name: "Sales Ach. Datin",         importance: 0.12, description: "Jumlah ketercapaian target penjualan produk Data Integration." },
      { name: "Sales Ach. Wi-Fi",         importance: 0.10, description: "Jumlah ketercapaian target penjualan produk Wi-Fi." },
      { name: "Collection Rate Ach.",     importance: 0.08, description: "Tingkat ketercapaian target pembayaran tagihan pelanggan." },
      { name: "Behaviour Ach.",           importance: 0.07, description: "Ketercapaian target frekuensi kunjungan pelanggan." },
      { name: "NPS",                      importance: 0.05, description: "Net Promoter Score Pelanggan." },
      { name: "Sales Ach. HSI",           importance: 0.04, description: "Jumlah ketercapaian target penjualan produk HSI." },
      { name: "Sales Ach. Wireline",      importance: 0.035, description: "Jumlah ketercapaian target penjualan produk Wireline." },
      { name: "Capability Ach.",          importance: 0.025, description: "Jumlah frekuensi pelatihan AE terhadap target." },
      { name: "Evaluation Quadrant",      importance: 0.015, description: "Kuadran evaluasi berdasarkan ketercapaian target scaling dan sustain." },
    ],
    []
  );

  const model: ModelInfo = useMemo(
    () => ({ name: "XGBoost", accuracy: 0.85, trainCount: 500 }),
    []
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search + Filters */}
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]"
          style={{ outlineOffset: -1 }}
        >
          <div className="flex-1 flex flex-col items-start">
            <div className="w-full text-black text-[20px] font-semibold leading-[30px]">Search Account Executive</div>
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
                <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as Quarter)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Informal Learning Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Informal Learning" description="Tracking and evaluation of AE informal learning">
            {loading ? (
              <div className="w-full min-h-[180px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CBD5E1] border-r-blue-500" />
                <span className="ml-3 text-[#164E9D] font-inter font-semibold">Loading...</span>
              </div>
            ) : error ? (
              <div className="w-full min-h-[160px] flex flex-col items-center justify-center">
                <div className="text-[#EF4444] font-semibold mb-3">{error}</div>
                <button
                  onClick={() => {
                    setQuarter((q) => (q === "Q1" ? "Q2" : "Q1"));
                    setTimeout(() => setQuarter("Q1"), 0);
                  }}
                  className="text-[#164E9D] underline"
                >
                  Coba lagi
                </button>
              </div>
            ) : informalRows.length === 0 ? (
              <div className="w-full min-h-[140px] flex items-center justify-center text-[#64748B]">
                Tidak ada data untuk filter yang dipilih.
              </div>
            ) : (
              <div className="-mx-4 sm:-mx-6 md:-mx-8">
                <div className="px-2 sm:px-4 md:px-6 mt-4">
                  <Table columns={informalCols} data={informalRows} pageSize={pageSize} showAction={false} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Formal Learning Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Formal Learning" description="Monitoring and evaluation of AE formal learning and certifications">
            {loading ? (
              <div className="w-full min-h-[180px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CBD5E1] border-r-blue-500" />
                <span className="ml-3 text-[#164E9D] font-inter font-semibold">Loading...</span>
              </div>
            ) : error ? (
              <div className="w-full min-h-[160px] flex flex-col items-center justify-center">
                <div className="text-[#EF4444] font-semibold mb-3">{error}</div>
                <button
                  onClick={() => {
                    setQuarter((q) => (q === "Q1" ? "Q2" : "Q1"));
                    setTimeout(() => setQuarter("Q1"), 0);
                  }}
                  className="text-[#164E9D] underline"
                >
                  Coba lagi
                </button>
              </div>
            ) : formalRows.length === 0 ? (
              <div className="w-full min-h-[140px] flex items-center justify-center text-[#64748B]">
                Tidak ada data untuk filter yang dipilih.
              </div>
            ) : (
              <div className="-mx-4 sm:-mx-6 md:-mx-8">
                <div className="px-2 sm:px-4 md:px-6 mt-4">
                  <Table columns={formalCols} data={formalRows} pageSize={pageSize} showAction={false} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold mb-3">Feature Importance</div>
          <FeatureImportanceSection
            features={features}
            model={model}
            guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model."
            guidanceFeature="Klik bar untuk melihat penjelasan fitur."
          />
        </div>
      </div>
    </div>
  );
}