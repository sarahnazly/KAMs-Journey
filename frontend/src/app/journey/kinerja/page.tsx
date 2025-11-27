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
  name: string;
  aeTools: number;
  capability: number;
  behaviour: number;
  year: number;
  quarter: Quarter;
};

type ResultRow = {
  nik: string;
  name: string;
  revenue: string;
  salesDatin: number;
  salesWifi: number;
  salesHSI: number;
  salesWireline: number;
  profitability: number;
  collectionRate: number;
  nps: number;
  year: number;
  quarter: Quarter;
};

const processData: ProcessRow[] = [
  {
    nik: "20919",
    name: "Ratu Nadya Anjania",
    aeTools: 100,
    capability: 0,
    behaviour: 14,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20971",
    name: "Sarah Nazly Nuraya",
    aeTools: 100,
    capability: 1,
    behaviour: 15,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20984",
    name: "Anindya Maulida Widyatmoko",
    aeTools: 100,
    capability: 1,
    behaviour: 143,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20992",
    name: "John Doe",
    aeTools: 100,
    capability: 0,
    behaviour: 5,
    year: 2025,
    quarter: "Q1",
  },
];

const resultData: ResultRow[] = [
  {
    nik: "20919",
    name: "Ratu Nadya Anjania",
    revenue: "Rp400.000.000",
    salesDatin: 100,
    salesWifi: 0,
    salesHSI: 0,
    salesWireline: 0,
    profitability: 0,
    collectionRate: 0,
    nps: 71,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20971",
    name: "Sarah Nazly Nuraya",
    revenue: "Rp400.000.000",
    salesDatin: 100,
    salesWifi: 2,
    salesHSI: 0,
    salesWireline: 0,
    profitability: 0,
    collectionRate: 0,
    nps: 71,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20984",
    name: "Anindya Maulida Widyatmoko",
    revenue: "Rp400.000.000",
    salesDatin: 200,
    salesWifi: 2,
    salesHSI: 0,
    salesWireline: 0,
    profitability: 0,
    collectionRate: 0,
    nps: 71,
    year: 2025,
    quarter: "Q1",
  },
  {
    nik: "20992",
    name: "John Doe",
    revenue: "Rp400.000.000",
    salesDatin: 0,
    salesWifi: 0,
    salesHSI: 2,
    salesWireline: 2,
    profitability: 2,
    collectionRate: 2,
    nps: 71,
    year: 2025,
    quarter: "Q1",
  },
];

export default function KinerjaPage(): JSX.Element {
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
          r.name.toLowerCase().includes(q)
      );
      filteredResult = filteredResult.filter(
        (r) =>
          r.nik.includes(search) ||
          r.name.toLowerCase().includes(q)
      );
    }

    setProcessRows(filteredProcess);
    setResultRows(filteredResult);
  }, [search, year, quarter]);

  const processCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Name", key: "name", sortable: true },
      { label: "AE Tools (%)", key: "aeTools", sortable: true },
      { label: "Capability", key: "capability", sortable: true },
      { label: "Behaviour", key: "behaviour", sortable: true },
    ],
    []
  );

  const resultCols: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Name", key: "name", sortable: true },
      { label: "Revenue", key: "revenue", sortable: true },
      { label: "Sales Datin", key: "salesDatin", sortable: true },
      { label: "Sales Wi-Fi", key: "salesWifi", sortable: true },
      { label: "Sales HSI", key: "salesHSI", sortable: true },
      { label: "Sales Wireline", key: "salesWireline", sortable: true },
      { label: "Profitability (%)", key: "profitability", sortable: true },
      { label: "Collection Rate (%)", key: "collectionRate", sortable: true },
      { label: "NPS", key: "nps", sortable: true },
    ],
    []
  );

  // Feature Importance data (lihat gambar, contoh acak)
  const features: Feature[] = useMemo(
    () => [
      { name: "Account Profile Duty", importance: 0.38, description: "Frekuensi kunjungan ke pelanggan." },
      { name: "Account Plan Duty", importance: 0.22, description: "Profil data account yang dikelola." },
      { name: "Customer Key Person", importance: 0.16, description: "Progress funnel penjualan." },
      { name: "Customer Requirement", importance: 0.11, description: "Kualitas dan eksekusi account plan." },
      { name: "Prebid Preparation", importance: 0.06, description: "Pengelolaan proses bidding/tender." },
      { name: "Invoice Pelanggan", importance: 0.04, description: "Kesesuaian solusi dan kebutuhan customer." },
      { name: "Proses Delivery", importance: 0.02, description: "Inisiasi pengenalan ke pelanggan baru." },
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
        router.push("/journey/kinerja");
        break;
      case "Evaluasi":
        router.push("/journey/evaluasi");
        break;
      case "Pengembangan":
        router.push("/journey/pengembangan");
        break;
      default:
        router.push("/journey/kinerja");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search + Filters */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]" style={{ outlineOffset: -1 }}>
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

      {/* Result Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Result" description="Evaluation and outcomes of AE performance">
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6 mt-4">
                <Table columns={resultCols} data={resultRows} pageSize={4} showAction={false} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Process Table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Process" description="Tracking and management of AE performance metrics">
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6 mt-4">
                <Table columns={processCols} data={processRows} pageSize={4} showAction={false} />
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