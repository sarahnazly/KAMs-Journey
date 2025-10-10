"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/dashboard/SearchBar";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import TabStage from "@/components/dashboard/TabStage";
import Table, { TableColumn } from "@/components/dashboard/Table";
import Card from "@/components/common/Card";

import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

type ProcessRow = {
  nik: string;
  nama: string;
  revenue: number;        // rupiah
  profitability: number;  // rupiah
  collectionRate: number; // 0..100 (%)
  totalCustomers: number;
  year: number;
  quarter: Quarter;
};

type ResultRow = {
  nik: string;
  nama: string;
  cnqScore: number;       // 0..100
  behaviourScore: number; // 0..100
  year: number;
  quarter: Quarter;
};

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

const clampPercent = (v: number) => Math.max(0, Math.min(100, v));

const stageToPath = (stage: string) => {
  switch (stage) {
    case "Onboarding":
      return "/journey/onboarding";
    case "On Duty":
      return "/journey/on-duty";
    case "Performance":
      return "/journey/performance";
    case "Evaluation":
      return "/journey/evaluation";
    case "Development":
      return "/journey/development";
    default:
      return "/journey/performance";
  }
};

export default function PerformancePage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [search, setSearch] = useState<string>("");
  const [year, setYear] = useState<number>(2025);
  const [quarter, setQuarter] = useState<Quarter>("Q1");

  // Loading/error
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Mock data sources (replace with real API calls when available)
  const processAll: ProcessRow[] = useMemo(
    () => [
      { nik: "20919", nama: "Ratu Nadya Anjania",         revenue: 400_000_000, profitability: 25_000_000, collectionRate: 80, totalCustomers: 100, year: 2025, quarter: "Q1" },
      { nik: "20971", nama: "Sarah Nazly Nuraya",         revenue: 400_000_000, profitability: 25_000_000, collectionRate: 80, totalCustomers: 100, year: 2025, quarter: "Q1" },
      { nik: "20984", nama: "Anindya Maulida Widyatmoko", revenue: 400_000_000, profitability: 25_000_000, collectionRate: 80, totalCustomers: 100, year: 2025, quarter: "Q1" },
      { nik: "20992", nama: "John Doe",                   revenue: 400_000_000, profitability: 25_000_000, collectionRate: 80, totalCustomers: 100, year: 2025, quarter: "Q1" },
      // duplicate demo (dedup by NIK)
      { nik: "20992", nama: "John Doe",                   revenue: 400_000_000, profitability: 25_000_000, collectionRate: 80, totalCustomers: 100, year: 2025, quarter: "Q1" },

      { nik: "20919", nama: "Ratu Nadya Anjania",         revenue: 350_000_000, profitability: 20_000_000, collectionRate: 75, totalCustomers: 90,  year: 2024, quarter: "Q4" },
    ],
    []
  );

  const resultAll: ResultRow[] = useMemo(
    () => [
      { nik: "20919", nama: "Ratu Nadya Anjania",         cnqScore: 100, behaviourScore: 86, year: 2025, quarter: "Q1" },
      { nik: "20971", nama: "Sarah Nazly Nuraya",         cnqScore: 100, behaviourScore: 86, year: 2025, quarter: "Q1" },
      { nik: "20984", nama: "Anindya Maulida Widyatmoko", cnqScore: 100, behaviourScore: 86, year: 2025, quarter: "Q1" },
      { nik: "20992", nama: "John Doe",                   cnqScore: 100, behaviourScore: 86, year: 2025, quarter: "Q1" },
      // duplicate demo (dedup by NIK)
      { nik: "20992", nama: "John Doe",                   cnqScore: 100, behaviourScore: 86, year: 2025, quarter: "Q1" },

      { nik: "20919", nama: "Ratu Nadya Anjania",         cnqScore: 98,  behaviourScore: 85, year: 2024, quarter: "Q4" },
    ],
    []
  );

  const dedupeByNik = <T extends { nik: string }>(rows: T[]): T[] => {
    const seen = new Set<string>();
    const unique: T[] = [];
    for (const row of rows) {
      if (!seen.has(row.nik)) {
        seen.add(row.nik);
        unique.push(row);
      }
    }
    return unique;
  };

  // Filtered datasets
  const [processRows, setProcessRows] = useState<ProcessRow[] | null>(null);
  const [resultRows, setResultRows] = useState<ResultRow[] | null>(null);

  // Simulate loading and handle errors (trigger error by adding ?fail=1 to URL)
  useEffect(() => {
    const shouldFail = searchParams.get("fail") === "1";
    setLoading(true);
    setError("");

    const t = setTimeout(() => {
      try {
        if (shouldFail) {
          throw new Error("Gagal mengambil data dari server. Coba lagi nanti.");
        }

        let p = processAll.filter((r) => r.year === year && r.quarter === quarter);
        let r = resultAll.filter((x) => x.year === year && x.quarter === quarter);

        if (search.trim()) {
          const q = search.toLowerCase();
          p = p.filter((row) => row.nik.includes(search) || row.nama.toLowerCase().includes(q));
          r = r.filter((row) => row.nik.includes(search) || row.nama.toLowerCase().includes(q));
        }

        p = dedupeByNik(p);
        r = dedupeByNik(r);

        setProcessRows(p);
        setResultRows(r);
      } catch (e: any) {
        setError(e?.message || "Terjadi kesalahan tak terduga.");
        setProcessRows(null);
        setResultRows(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [search, year, quarter, processAll, resultAll, searchParams]);

  // Columns definition (sortable where required)
  const processCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Nama", key: "nama", sortable: true },
      {
        label: "Revenue",
        key: "revenue",
        sortable: true,
        render: (v) => formatRupiah(Number(v || 0)),
      },
      {
        label: "Profitability",
        key: "profitability",
        sortable: true,
        render: (v) => formatRupiah(Number(v || 0)),
      },
      {
        label: "Collection Rate",
        key: "collectionRate",
        sortable: true,
        render: (v) => `${clampPercent(Number(v || 0))}%`,
      },
      { label: "Total Customers", key: "totalCustomers", sortable: true },
    ],
    []
  );

  const resultCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Nama", key: "nama", sortable: true },
      { label: "CnQ Test Score", key: "cnqScore", sortable: true },
      { label: "Behaviour Score", key: "behaviourScore", sortable: true },
    ],
    []
  );

  // Feature importance data
  const features: Feature[] = useMemo(
    () => [
      { name: "account_profile_duty",        importance: 0.18, description: "Profil akun dan kelengkapan data." },
      { name: "account_plan_duty",           importance: 0.12, description: "Rencana strategis pengelolaan akun." },
      { name: "customer_requirement",        importance: 0.16, description: "Kelengkapan dan kedalaman requirement." },
      { name: "identifikasi_potensi_proyek", importance: 0.10, description: "Identifikasi potensi proyek baru." },
      { name: "demo_poc",                    importance: 0.08, description: "Pelaksanaan demo/PoC." },
      { name: "desain_proposal",             importance: 0.07, description: "Penyusunan desain dan proposal." },
      { name: "prebid_preparation",          importance: 0.06, description: "Kesiapan pre-bid." },
      { name: "risk_project_assessment",     importance: 0.05, description: "Penilaian risiko proyek." },
      { name: "proses_delivery",             importance: 0.04, description: "Proses delivery berjalan baik." },
      { name: "invoice_pelanggan",           importance: 0.03, description: "Ketepatan penerbitan invoice." },
      { name: "komplain_pelanggan",          importance: 0.025, description: "Penanganan komplain pelanggan." },
      { name: "customer_key_person",         importance: 0.022, description: "Hubungan dengan key person pelanggan." },
      { name: "total_pic",                   importance: 0.02, description: "Jumlah PIC yang ditangani." },
      { name: "action_to_grow_relationship", importance: 0.018, description: "Aksi untuk penguatan relasi." },
      { name: "metode_komunikasi",           importance: 0.015, description: "Metode komunikasi yang digunakan." },
    ],
    []
  );

  const model: ModelInfo = useMemo(
    () => ({
      name: "XGBoost",
      accuracy: 0.85,
      trainCount: 500,
    }),
    []
  );

  const guidanceFeatureImportance =
    "Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model.";
  const guidanceFeature =
    "Klik bar untuk melihat penjelasan fitur. Gunakan tombol Show Guidance untuk menampilkan panel detail.";

  const handleStageChange = (stage: string) => {
    router.push(stageToPath(stage));
  };

  // UI
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search + Filters card */}
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]"
          style={{ outlineOffset: -1 }}
        >
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
                <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as Quarter)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TabStage align center (menggunakan komponen yang ada) */}
      <div className="w-full flex items-center justify-center mb-4">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Process Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Process" description="Tracking and management of AM performance metrics">

            {loading ? (
              <div className="w-full min-h-[180px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CBD5E1] border-r-blue-500" />
                <span className="ml-3 text-[#164E9D] font-inter font-semibold">Loading...</span>
              </div>
            ) : error ? (
              <div className="w-full min-h-[140px] flex flex-col items-center justify-center">
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
            ) : !processRows || processRows.length === 0 ? (
              <div className="w-full min-h-[140px] flex items-center justify-center text-[#64748B]">
                Tidak ada data untuk filter yang dipilih.
              </div>
            ) : (
              <div className="-mx-4 sm:-mx-6 md:-mx-8">
                <div className="px-2 sm:px-4 md:px-6 mt-4">
                  <Table columns={processCols} data={processRows} pageSize={4} showAction={false} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Result Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Result" description="Evaluation and outcomes of AM performance">

            {loading ? (
              <div className="w-full min-h-[180px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CBD5E1] border-r-blue-500" />
                <span className="ml-3 text-[#164E9D] font-inter font-semibold">Loading...</span>
              </div>
            ) : error ? (
              <div className="w-full min-h-[140px] flex flex-col items-center justify-center">
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
            ) : !resultRows || resultRows.length === 0 ? (
              <div className="w-full min-h-[140px] flex items-center justify-center text-[#64748B]">
                Tidak ada data untuk filter yang dipilih.
              </div>
            ) : (
              <div className="-mx-4 sm:-mx-6 md:-mx-8">
                <div className="px-2 sm:px-4 md:px-6 mt-4">
                  <Table columns={resultCols} data={resultRows} pageSize={4} showAction={false} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Feature Importance Section */}
      <div className="w-full flex items-center justify-center mb-20 ">
        <div className="max-w-[1100px] w-full">
          <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold mb-3">Feature Importance</div>
          <FeatureImportanceSection
            features={features}
            model={model}
            guidanceFeatureImportance={guidanceFeatureImportance}
            guidanceFeature={guidanceFeature}
          />
        </div>
      </div>
    </div>
  );
}