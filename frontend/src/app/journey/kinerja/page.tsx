"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

// -----------------------------
// Helpers
// -----------------------------
const formatRp = (v: number) =>
  "Rp " + v.toLocaleString("id-ID", { minimumFractionDigits: 0 });

const formatInt = (v: number | null | undefined) => {
  if (v === null || v === undefined) return "-";
  return Math.round(v); 
};

const round2 = (v: number) => Number(v.toFixed(2));

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

// -----------------------------
// Main Component
// -----------------------------
export default function KinerjaPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [year, setYear] = useState(2025);
  const [quarter, setQuarter] = useState<Quarter>("Q1");

  // Data states
  const [processRows, setProcessRows] = useState<any[]>([]);
  const [resultRows, setResultRows] = useState<any[]>([]);
  const [fiFeatures, setFiFeatures] = useState<Feature[]>([]);
  const [fiModel, setFiModel] = useState<ModelInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // -----------------------------
  // Fetch data from backend
  // -----------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const qParam = `${quarter} ${year}`;
        const encoded = encodeURIComponent(qParam);

        // -------------------------
        // FETCH KINERJA DATA
        // -------------------------
        const resKin = await fetch(
          `${API}/kinerja/${encoded}`
        );

        if (!resKin.ok) throw new Error("Failed fetching kinerja");

        const data = await resKin.json();

        // PROCESS TABLE: ae_tools, capability, behaviour
        const processMapped = data.map((d: any) => ({
          nik: String(d.nik),
          name: d.name,
          aeTools: round2((d.ae_tools ?? 0) * 100),
          capability: d.capability,
          behaviour: d.behaviour,
          quarter,
          year,
        }));

        // RESULT TABLE
        const resultMapped = data.map((d: any) => ({
          nik: String(d.nik),
          name: d.name,
          revenue: formatRp(d.revenue ?? 0),
          salesDatin: d.sales_datin,
          salesWifi: d.sales_wifi,
          salesHSI: d.sales_hsi,
          salesWireline: d.sales_wireline,
          profitability: round2((d.profitability ?? 0) * 100),
          collectionRate: round2((d.collection_rate ?? 0) * 100),
          nps: d.nps,
          quarter,
          year,
        }));

        // ---- Apply Search ----
        const q = search.toLowerCase();
        const filter = (r: any) =>
          r.nik.includes(search) || r.name.toLowerCase().includes(q);

        setProcessRows(search ? processMapped.filter(filter) : processMapped);
        setResultRows(search ? resultMapped.filter(filter) : resultMapped);

        // -------------------------
        // FETCH FEATURE IMPORTANCE
        // -------------------------
        const resFI = await fetch(
          `${API}/fi/pelaksanaan_to_kinerja`
        );

        if (!resFI.ok) throw new Error("FI load failed");

        const fi = await resFI.json();

        const mappedFI: Feature[] = fi.features.map((f: any) => ({
          name: f.feature,
          importance: Number(f.importance),
          description: f.description,
        }));

        const modelMeta: ModelInfo = {
          name: fi.meta.best_regressor,
          R2: fi.meta.metrics_overall.R2,
          trainCount: 2000,
        };

        setFiFeatures(mappedFI);
        setFiModel(modelMeta);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [quarter, year, search]);

  // -----------------------------
  // Table Columns
  // -----------------------------
  const processCols: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    { label: "AE Tools (%)", key: "aeTools", sortable: true },
    { label: "Capability", key: "capability", sortable: true, render: (v) => formatInt(v) },
    { label: "Behaviour", key: "behaviour", sortable: true, render: (v) => formatInt(v) },
  ];

  const resultCols: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    { label: "Revenue", key: "revenue", sortable: true },
    { label: "Sales Datin", key: "salesDatin", sortable: true, render: (v) => formatInt(v) },
    { label: "Sales Wi-Fi", key: "salesWifi", sortable: true, render: (v) => formatInt(v) },
    { label: "Sales HSI", key: "salesHSI", sortable: true, render: (v) => formatInt(v) },
    { label: "Sales Wireline", key: "salesWireline", sortable: true, render: (v) => formatInt(v) },
    { label: "Profitability (%)", key: "profitability", sortable: true },
    { label: "Collection Rate (%)", key: "collectionRate", sortable: true },
    { label: "NPS", key: "nps", sortable: true, render: (v) => formatInt(v) },
  ];

  // -----------------------------
  // Navigation Tabs
  // -----------------------------
  const handleStageChange = (stage: string) => {
    router.push(`/journey/${stage.toLowerCase()}`);
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (loading)
    return <div className="w-full text-center py-20">Loading...</div>;

  if (error)
    return <div className="w-full text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="w-full flex flex-col gap-6">

      {/* Search + Filters */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] px-5 py-[30px] flex flex-row gap-4">
          <div className="flex-1">
            <p className="text-[20px] font-semibold mb-1">Search Account Executive</p>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-[200px]">
              <p className="text-[20px] font-semibold">Tahun</p>
              <FilterYear value={year} onChange={setYear} />
            </div>
            <div className="w-[200px]">
              <p className="text-[20px] font-semibold">Periode</p>
              <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as Quarter)} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="max-w-[1100px] w-full flex justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* RESULT TABLE */}
      <div className="flex justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Result" description="Evaluation and outcomes of AE performance">
            <div className="mt-4 px-2 sm:px-4 md:px-6">
              <Table columns={resultCols} data={resultRows} pageSize={10} showAction={false} />
            </div>
          </Card>
        </div>
      </div>

      {/* PROCESS TABLE */}
      <div className="flex justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Process" description="Tracking and management of AE performance metrics">
            <div className="mt-4 px-2 sm:px-4 md:px-6">
              <Table columns={processCols} data={processRows} pageSize={10} showAction={false} />
            </div>
          </Card>
        </div>
      </div>

      {/* FEATURE IMPORTANCE */}
      <div className="w-full flex justify-center mt-10 mb-20">
        <div className="max-w-[1100px] w-full">
          <div className="text-[24px] font-bold mb-3">Feature Importance</div>

          {fiModel && (
            <FeatureImportanceSection
              features={fiFeatures}
              model={fiModel}
              guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model."
              guidanceFeature="Klik bar untuk melihat penjelasan fitur."
            />
          )}
        </div>
      </div>
    </div>
  );
}
