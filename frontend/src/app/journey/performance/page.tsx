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

type ProcessRow = {
  nik: string;
  nama: string;
  revenue: string;
  profitability: string;
  collectionRate: string;
  totalCustomers: number;
  year: number;
  quarter: Quarter;
};

type ResultRow = {
  nik: string;
  nama: string;
  cnqScore: number;
  behaviourScore: number;
  year: number;
  quarter: Quarter;
};

const processData: ProcessRow[] = [
  {
    nik: "20919",
    nama: "Ratu Nadya Anjania",
    revenue: "Rp400.000.000",
    profitability: "Rp25.000.000",
    collectionRate: "80%",
    totalCustomers: 100,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20971",
    nama: "Sarah Nazly Nuraya",
    revenue: "Rp400.000.000",
    profitability: "Rp25.000.000",
    collectionRate: "80%",
    totalCustomers: 100,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20984",
    nama: "Anindya Maulida Widyatmoko",
    revenue: "Rp400.000.000",
    profitability: "Rp25.000.000",
    collectionRate: "80%",
    totalCustomers: 100,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20992",
    nama: "John Doe",
    revenue: "Rp400.000.000",
    profitability: "Rp25.000.000",
    collectionRate: "80%",
    totalCustomers: 100,
    year: 2025,
    quarter: "Q1",
  },
];

const resultData: ResultRow[] = [
  {
    nik: "20919",
    nama: "Ratu Nadya Anjania",
    cnqScore: 100,
    behaviourScore: 86,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20971",
    nama: "Sarah Nazly Nuraya",
    cnqScore: 100,
    behaviourScore: 86,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20984",
    nama: "Anindya Maulida Widyatmoko",
    cnqScore: 100,
    behaviourScore: 86,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20992",
    nama: "John Doe",
    cnqScore: 100,
    behaviourScore: 86,
    year: 2025,
    quarter: "Q1",
  },
];

export default function PerformancePage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number>(2025);
  const [quarter, setQuarter] = useState<Quarter>("Q1");

  // Table data state
  const [processRows, setProcessRows] = useState<ProcessRow[]>(processData);
  const [resultRows, setResultRows] = useState<ResultRow[]>(resultData);

  // Filter table data (simulate API/filter)
  useEffect(() => {
    let filteredProcess = processData.filter(
      (r) => r.year === year && r.quarter === quarter
    );
    let filteredResult = resultData.filter(
      (r) => r.year === year && r.quarter === quarter
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      filteredProcess = filteredProcess.filter(
        (r) =>
          r.nik.includes(search) ||
          r.nama.toLowerCase().includes(q)
      );
      filteredResult = filteredResult.filter(
        (r) =>
          r.nik.includes(search) ||
          r.nama.toLowerCase().includes(q)
      );
    }

    setProcessRows(filteredProcess);
    setResultRows(filteredResult);
  }, [search, year, quarter]);

  const processCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Nama", key: "nama", sortable: true },
      { label: "Revenue", key: "revenue", sortable: true },
      { label: "Profitability", key: "profitability", sortable: true },
      { label: "Collection Rate", key: "collectionRate", sortable: true },
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

  // Feature Importance data (lihat gambar, contoh acak)
  const features: Feature[] = useMemo(
    () => [
      { name: "Visiting Customer", importance: 0.38, description: "Frekuensi kunjungan ke pelanggan." },
      { name: "Account Profile", importance: 0.22, description: "Profil data account yang dikelola." },
      { name: "Sales Funnel", importance: 0.16, description: "Progress funnel penjualan." },
      { name: "Account Plan", importance: 0.11, description: "Kualitas dan eksekusi account plan." },
      { name: "Bidding Management", importance: 0.06, description: "Pengelolaan proses bidding/tender." },
      { name: "Customer Matching", importance: 0.04, description: "Kesesuaian solusi dan kebutuhan customer." },
      { name: "Customer Introduction", importance: 0.02, description: "Inisiasi pengenalan ke pelanggan baru." },
    ],
    []
  );

  const model: ModelInfo = useMemo(
    () => ({ name: "XGBoost", accuracy: 0.85, trainCount: 500 }),
    []
  );

  // Tab navigation
  const handleStageChange = (stage: string) => {
    switch (stage) {
      case "Orientasi":
        router.push("/journey/orientasi");
        break;
      case "Pelaksanaan":
        router.push("/journey/pelaksanaan");
        break;
      case "Kinerja":
        router.push("/journey/performance");
        break;
      case "Evaluasi":
        router.push("/journey/evaluation");
        break;
      case "Pengembangan":
        router.push("/journey/development");
        break;
      default:
        router.push("/journey/performance");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search + Filters */}
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

      {/* Process Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Process" description="Tracking and management of AM performance metrics">
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6 mt-4">
                <Table columns={processCols} data={processRows} pageSize={4} showAction={false} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Result Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Result" description="Evaluation and outcomes of AM performance">
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6 mt-4">
                <Table columns={resultCols} data={resultRows} pageSize={4} showAction={false} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold mb-4">Feature Importance</div>
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