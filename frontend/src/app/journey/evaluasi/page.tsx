"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import FilterYear from "@/components/dashboard/FilterYear";
import MetricCard from "@/components/dashboard/evaluasi/MetricCard";
import TabStage from "@/components/dashboard/TabStage";
import Table, { TableColumn } from "@/components/dashboard/Table";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";
import { Search } from "lucide-react";

// ---------------------------------------------
// TYPE DEFINITIONS
// ---------------------------------------------
type EvaluasiRow = {
  nik: string;
  name: string;
  revenueSalesAch: number;
  salesAchDatin: number;
  salesAchWifi: number;
  salesAchHSI: number;
  salesAchWireline: number;
  profitabilityAch: number;
  collectionRateAch: number;
  aeToolsAch: number;
  capabilityAch: number;
  behaviourAch: number;
  nps: number;
  evaluationQuadrant: number;
  quarter: string;
  year: number;
};

type ColumnCategory = "overview" | "result" | "process";
type ResultSubcategory = "financial" | "sales" | "customer";
type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

// ---------------------------------------------
// CATEGORY CONFIG
// ---------------------------------------------
const COLUMN_CATEGORIES = [
  { key: "overview", label: "Overview", hasSubcategories: false },
  { key: "result", label: "Result", hasSubcategories: true },
  { key: "process", label: "Process", hasSubcategories: false },
] as const;

const RESULT_SUBCATEGORIES = [
  { key: "financial", label: "Financial Metrics" },
  { key: "sales", label: "Sales Performance" },
  { key: "customer", label: "Customer" },
] as const;

// ---------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------
export default function EvaluasiOverviewPage() {
  const router = useRouter();

  // FILTER STATE
  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState("Q1");
  const [year, setYear] = useState(2025);

  // TABLE STATE
  const [data, setData] = useState<EvaluasiRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CATEGORY STATE
  const [columnCategory, setColumnCategory] =
    useState<ColumnCategory>("overview");
  const [resultSubcategory, setResultSubcategory] =
    useState<ResultSubcategory>("financial");

  // FEATURE IMPORTANCE
  const [fiFeatures, setFiFeatures] = useState<Feature[]>([]);
  const [fiModel, setFiModel] = useState<ModelInfo | null>(null);

  // ---------------------------------------------
  // CHECK SUBCATEGORY SUPPORT
  // ---------------------------------------------
  const currentHasSubcategories = useMemo(() => {
    const found = COLUMN_CATEGORIES.find((c) => c.key === columnCategory);
    return found?.hasSubcategories ?? false;
  }, [columnCategory]);

  useEffect(() => {
    if (columnCategory === "result") {
      setResultSubcategory("financial");
    }
  }, [columnCategory]);

  // ---------------------------------------------
  // ROUTE MAPPER
  // ---------------------------------------------
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
        return "/journey/evaluasi";
    }
  };

  const handleStageChange = (stage: string) => {
    router.push(stageToPath(stage));
  };

  // ---------------------------------------------
  // FETCH EVALUASI DATA
  // ---------------------------------------------
  useEffect(() => {
    async function loadEvaluasi() {
      try {
        setLoading(true);
        setError("");

        const q = `${quarter} ${year}`;
        const res = await fetch(`http://localhost:8000/evaluasi/${q}`);

        if (!res.ok) throw new Error("Failed fetching evaluasi data");

        const raw = await res.json();

        const mapped: EvaluasiRow[] = raw.map((r: any) => ({
          nik: r.nik,
          name: r.name,
          revenueSalesAch: r.revenue_sales_achievement * 100,
          salesAchDatin: r.sales_achievement_datin * 100,
          salesAchWifi: r.sales_achievement_wifi * 100,
          salesAchHSI: r.sales_achievement_hsi * 100,
          salesAchWireline: r.sales_achievement_wireline * 100,
          profitabilityAch: r.profitability_achievement * 100,
          collectionRateAch: r.collection_rate_achievement * 100,
          aeToolsAch: r.ae_tools_achievement * 100,
          capabilityAch: r.capability_achievement * 100,
          behaviourAch: r.behaviour_achievement * 100,
          nps: r.nps_achievement * 100,
          evaluationQuadrant: r.kuadran,
          prediction: "detail",
          quarter: r.quarter,
          year: year,
        }));

        setData(mapped);
      } catch (e: any) {
        setError(e.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvaluasi();
  }, [quarter, year]);

  // ---------------------------------------------
  // CALCULATE METRIC AVERAGES
  // ---------------------------------------------
  const avg = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "0";

  const avgRevenue = avg(data.map((d) => d.revenueSalesAch));
  const avgTools = avg(data.map((d) => d.aeToolsAch));
  const avgProfit = avg(data.map((d) => d.profitabilityAch));
  const avgNPS = avg(data.map((d) => d.nps));

  // ---------------------------------------------
  // FETCH FEATURE IMPORTANCE
  // ---------------------------------------------
  useEffect(() => {
    async function loadFI() {
      try {
        const q = `${quarter} ${year}`;
        const res = await fetch(
          `http://localhost:8000/fi/kinerja_to_evaluasi/${q}`
        );
        const json = await res.json();

        const modelName = json.meta.best_regressor;
        const modelR2 = json.meta.metrics_overall.R2;

        setFiModel({
          name: modelName,
          R2: modelR2,
          trainCount: 700,
        });

        const fi = json.features
          .filter((f: any) => f.quarter === `${quarter} ${year}`)
          .map((f: any) => ({
            name: f.feature,
            importance: f.importance,
            description: f.description,
          }));

        setFiFeatures(fi);
      } catch (e) {
        console.log("FI LOAD ERROR:", e);
      }
    }

    loadFI();
  }, [quarter, year]);

  // ---------------------------------------------
  // TABLE COLUMN DEFINITIONS
  // ---------------------------------------------
  const baseColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
  ];

  const predictionsColumn: TableColumn = {
    label: "Predictions",
    key: "pred",
    sortable: false,
    render: (_v, row) => (
      <button
        onClick={() => router.push(`/journey/evaluasi/${row.nik}/predictions`)}
        className="text-[#1464D5]"
      >
        <Search size={16} />
      </button>
    ),
  };

  const currentColumns: TableColumn[] = useMemo(() => {
    if (columnCategory === "overview") {
      return [
        ...baseColumns,
        { label: "Revenue Sales Ach. (%)", key: "revenueSalesAch" },
        { label: "Profitability Ach. (%)", key: "profitabilityAch" },
        { label: "AE Tools Ach. (%)", key: "aeToolsAch" },
        { label: "NPS (%)", key: "nps" },
        predictionsColumn,
        { label: "Evaluation Quadrant", key: "evaluationQuadrant" },
      ];
    }

    if (columnCategory === "result") {
      switch (resultSubcategory) {
        case "financial":
          return [
            ...baseColumns,
            { label: "Revenue Sales Ach. (%)", key: "revenueSalesAch" },
            { label: "Profitability Ach. (%)", key: "profitabilityAch" },
            { label: "Collection Rate Ach. (%)", key: "collectionRateAch" },
          ];
        case "sales":
          return [
            ...baseColumns,
            { label: "Sales Ach. Datin (%)", key: "salesAchDatin" },
            { label: "Sales Ach. Wi-Fi (%)", key: "salesAchWifi" },
            { label: "Sales Ach. HSI (%)", key: "salesAchHSI" },
            { label: "Sales Ach. Wireline (%)", key: "salesAchWireline" },
          ];
        case "customer":
          return [...baseColumns, { label: "NPS (%)", key: "nps" }];
      }
    }

    // PROCESS TAB
    return [
      ...baseColumns,
      { label: "AE Tools Ach. (%)", key: "aeToolsAch" },
      { label: "Capability Ach. (%)", key: "capabilityAch" },
      { label: "Behaviour Ach. (%)", key: "behaviourAch" },
    ];
  }, [columnCategory, resultSubcategory]);

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
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

      {/* AVERAGE CARDS */}
      <div className="w-full flex justify-center mb-6">
        <div className="max-w-[1100px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Avg.Revenue Sales Achievement" value={`${avgRevenue}%`} />
          <MetricCard label="Avg.AE Tools Achievement" value={`${avgTools}%`} />
          <MetricCard label="Avg.Profitability Achievement" value={`${avgProfit}%`} />
          <MetricCard label="Avg.NPS" value={`${avgNPS}%`} />
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="w-full flex justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card heading="Performance Evaluation" description="Assess metrics and follow-up details">
            {/* CATEGORY TABS */}
            <div className="flex gap-2 mt-4 mb-4 border-b pb-4">
              {COLUMN_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setColumnCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg ${
                    columnCategory === cat.key
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* SUBCATEGORIES */}
            {currentHasSubcategories && (
              <div className="flex gap-2 mb-6">
                {RESULT_SUBCATEGORIES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setResultSubcategory(s.key)}
                    className={`px-3 py-1.5 rounded-full border ${
                      resultSubcategory === s.key
                        ? "bg-blue-100 text-blue-700 border-blue-700"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* TABLE */}
            <Table
              columns={currentColumns}
              data={data}
              loading={loading}
              error={error}
              pageSize={4}
              showAction={false}
            />
          </Card>
        </div>
      </div>

      {/* FEATURE IMPORTANCE */}
      <div className="w-full flex justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <div className="text-[24px] font-bold mb-3">Feature Importance</div>

          {fiModel && (
            <FeatureImportanceSection
              features={fiFeatures}
              model={fiModel}
              guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model evaluasi kinerja AE."
              guidanceFeature="Klik bar untuk melihat penjelasan fitur."
            />
          )}
        </div>
      </div>
    </div>
  );
}
