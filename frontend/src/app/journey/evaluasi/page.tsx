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
  prediction: string;
  evaluationQuadrant: number;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
};

type ColumnGroup = "overview" | "sales" | "financial" | "operational" | "people";

// Column group configuration
const COLUMN_GROUP_CONFIG: { key: ColumnGroup; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "sales", label: "Sales Performance" },
  { key: "financial", label: "Financial Metrics" },
  { key: "operational", label: "Operational & Tools" },
  { key: "people", label: "People & Culture" },
];

export default function EvaluasiOverviewPage() {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [year, setYear] = useState<number>(2025);
  const [category, setCategory] = useState<string>("All");

  // Column group state
  const [columnGroup, setColumnGroup] = useState<ColumnGroup>("overview");

  // Table state
  const [data, setData] = useState<EvaluasiRow[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle Predictions Detail Click - Navigate to [nik] page
  const handlePredictionsDetailClick = (row: Record<string, any>) => {
    router.push(`/journey/evaluasi/${row.nik}/predictions`);
  };

  // Column definitions by group
  const columnGroups: Record<ColumnGroup, TableColumn[]> = useMemo(
    () => ({
      overview: [
        { label: "NIK", key: "nik", sortable: true },
        { label: "Name", key: "name", sortable: true },
        { label: "Revenue Sales Ach. (%)", key: "revenueSalesAch", sortable: true },
        { label: "Profitability Ach. (%)", key: "profitabilityAch", sortable: true },
        { label: "AE Tools Ach. (%)", key: "aeToolsAch", sortable: true },
        { label: "NPS (%)", key: "nps", sortable: true },
        {
          label: "Predictions",
          key: "predictions",
          sortable: false,
          render: (_value: any, row: Record<string, any>) => (
            <button
              onClick={() => handlePredictionsDetailClick(row)}
              className="text-[#1464D5] hover:text-[#0D4BA6] transition-colors flex items-center justify-center mx-auto"
              title="View Predictions"
            >
              <Search size={16} />
            </button>
          ),
        },
        { label: "Evaluation Quadrant", key: "evaluationQuadrant", sortable: true },
      ],
      sales: [
        { label: "NIK", key: "nik", sortable: true },
        { label: "Name", key: "name", sortable: true },
        { label: "Revenue Sales Ach. (%)", key: "revenueSalesAch", sortable: true },
        { label: "Sales Ach. Datin (%)", key: "salesAchDatin", sortable: true },
        { label: "Sales Ach. Wi-Fi (%)", key: "salesAchWifi", sortable: true },
        { label: "Sales Ach. HSI (%)", key: "salesAchHSI", sortable: true },
        { label: "Sales Ach. Wireline (%)", key: "salesAchWireline", sortable: true },
      ],
      financial: [
        { label: "NIK", key: "nik", sortable: true },
        { label: "Name", key: "name", sortable: true },
        { label: "Profitability Ach. (%)", key: "profitabilityAch", sortable: true },
        { label: "Collection Rate Ach. (%)", key: "collectionRateAch", sortable: true },
      ],
      operational: [
        { label: "NIK", key: "nik", sortable: true },
        { label: "Name", key: "name", sortable: true },
        { label: "AE Tools (%)", key: "aeToolsAch", sortable: true },
      ],
      people: [
        { label: "NIK", key: "nik", sortable: true },
        { label: "Name", key: "name", sortable: true },
        { label: "Capability Ach. (%)", key: "capabilityAch", sortable: true },
        { label: "Behaviour Ach. (%)", key: "behaviourAch", sortable: false },
        { label: "NPS (%)", key: "nps", sortable: true },
      ],
    }),
    []
  );

  const currentColumns = columnGroups[columnGroup];

  // Dummy data
  const allData: EvaluasiRow[] = useMemo(
    () => [
      {
        nik: "20919",
        name: "Ratu Nadya Anjania",
        revenueSalesAch: 80,
        salesAchDatin: 80,
        salesAchWifi: 80,
        salesAchHSI: 70,
        salesAchWireline: 75,
        profitabilityAch: 55,
        collectionRateAch: 3,
        aeToolsAch: 3,
        capabilityAch: 3,
        behaviourAch: 5.8,
        nps: 3,
        prediction: "detail",
        evaluationQuadrant: 4,
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20971",
        name: "Sarah Nazly Nuraya",
        revenueSalesAch: 80,
        salesAchDatin: 80,
        salesAchWifi: 80,
        salesAchHSI: 75,
        salesAchWireline: 80,
        profitabilityAch: 55,
        collectionRateAch: 3,
        aeToolsAch: 3,
        capabilityAch: 3,
        behaviourAch: 6.3,
        nps: 3,
        prediction: "detail",
        evaluationQuadrant: 2,
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20984",
        name: "Anindya Maulida Widyatmoko",
        revenueSalesAch: 80,
        salesAchDatin: 80,
        salesAchWifi: 80,
        salesAchHSI: 80,
        salesAchWireline: 78,
        profitabilityAch: 55,
        collectionRateAch: 3,
        aeToolsAch: 3,
        capabilityAch: 3,
        behaviourAch: 7.5,
        nps: 3,
        prediction: "detail",
        evaluationQuadrant: 4,
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20992",
        name: "John Doe",
        revenueSalesAch: 80,
        salesAchDatin: 80,
        salesAchWifi: 80,
        salesAchHSI: 65,
        salesAchWireline: 80,
        profitabilityAch: 55,
        collectionRateAch: 3,
        aeToolsAch: 3,
        capabilityAch: 3,
        behaviourAch: 5.8,
        nps: 3,
        prediction: "detail",
        evaluationQuadrant: 3,
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20993",
        name: "Jane Smith",
        revenueSalesAch: 80,
        salesAchDatin: 80,
        salesAchWifi: 80,
        salesAchHSI: 65,
        salesAchWireline: 80,
        profitabilityAch: 55,
        collectionRateAch: 3,
        aeToolsAch: 3,
        capabilityAch: 3,
        behaviourAch: 5.8,
        nps: 3,
        prediction: "detail",
        evaluationQuadrant: 3,
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20994",
        name: "Ahmad Yani",
        revenueSalesAch: 80,
        salesAchDatin: 80,
        salesAchWifi: 80,
        salesAchHSI: 65,
        salesAchWireline: 80,
        profitabilityAch: 55,
        collectionRateAch: 3,
        aeToolsAch: 3,
        capabilityAch: 3,
        behaviourAch: 5.8,
        nps: 3,
        prediction: "detail",
        evaluationQuadrant: 3,
        quarter: "Q1",
        year: 2025,
      },
    ],
    []
  );

  // Map stage TabStage -> route
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

  // Dedupe helper
  const dedupeByNik = (rows: EvaluasiRow[]) => {
    const seen = new Set<string>();
    const unique: EvaluasiRow[] = [];
    for (const r of rows) {
      if (!seen. has(r. nik)) {
        seen.add(r.nik);
        unique.push(r);
      }
    }
    return unique;
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    const t = setTimeout(() => {
      let filtered = allData. filter(
        (row) => row.quarter === quarter && row. year === year
      );
      filtered = dedupeByNik(filtered);

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (row) =>
            row.name. toLowerCase().includes(q) || row.nik. includes(search)
        );
      }

      setData(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [allData, quarter, year, search, category]);

  // TabStage navigation
  const handleStageChange = (stage: string) => {
    const path = stageToPath(stage);
    router.push(path);
  };

  // Feature Importance data
  const features: Feature[] = useMemo(
    () => [
      {
        name: "Revenue",
        importance: 0.35,
        description: "Keseluruhan pendapatan AE per kuartal.",
      },
      {
        name: "Behaviour",
        importance: 0.3,
        description: "Jumlah frekuensi AE melakukan kunjungan pelanggan.",
      },
      {
        name: "Profitability",
        importance: 0.25,
        description: "Keseluruhan profitabilitas AE per kuartal.",
      },
      {
        name: "AE Tools",
        importance: 0.15,
        description: "Tingkat penggunaan tools AE.",
      },
      {
        name: "Collection Rate",
        importance: 0.1,
        description: "Jumlah persentase pembayaran oleh pelanggan AE.",
      },
      {
        name: "NPS",
        importance: 0.08,
        description: "Net Promoter Score pelanggan.",
      },
      {
        name: "Sales Datin",
        importance: 0.08,
        description: "Jumlah penjualan produk Data Integration.",
      },
      {
        name: "Sales Wi-Fi",
        importance: 0.076,
        description: "Jumlah penjualan produk Wi-Fi.",
      },
      {
        name: "Sales HSI",
        importance: 0.075,
        description: "Jumlah penjualan produk HSI.",
      },
      {
        name: "Sales Wireline",
        importance: 0.0,
        description: "Jumlah penjualan produk Wireline.",
      },
    ],
    []
  );

  const model: ModelInfo = useMemo(
    () => ({ name: "XGBoost", accuracy: 0.85, trainCount: 500 }),
    []
  );

  return (
    <div className="w-full">
      {/* Search + Filters card */}
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]"
          style={{ outlineOffset: -1 }}
        >
          <div className="flex-1 flex flex-col items-start">
            <div className="w-full text-black text-[20px] font-semibold leading-[30px]">
              Search Account Executive
            </div>
            <SearchBar value={search} onChange={setSearch} className="w-full" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-[200px]">
              <div className="text-black text-[20px] font-semibold leading-[24px]">
                Tahun
              </div>
              <div className="w-full flex items-center justify-between gap-[72px] bg-white rounded-[5px] border-[#CBD5E1] mt-1">
                <FilterYear value={year} onChange={setYear} />
              </div>
            </div>
            <div className="w-[200px]">
              <div className="text-black text-[20px] font-semibold leading-[24px]">
                Periode
              </div>
              <div className="w-full flex items-center justify-between gap-[72px] bg-white rounded-[5px] border-[#CBD5E1] mt-1">
                <FilterQuarter
                  value={quarter}
                  onChange={(q) => setQuarter(q as any)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TabStage align center */}
      <div className="w-full flex items-center justify-center mb-4 mt-4">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="w-full flex justify-center mb-6">
        <div className="max-w-[1100px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Avg. Revenue Sales Achievement" value="92%" />
          <MetricCard label="Avg. AE Tools Achievement" value="3%" />
          <MetricCard label="Avg. Profitability Achievement" value="10%" />
          <MetricCard label="Avg.  NPS" value="3%" />
        </div>
      </div>

      {/* Performance Evaluation Card */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card
            heading="Performance Evaluation"
            description="Assessing employee metrics and follow-up details"
          >
            {/* Column Group Tabs */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6 border-b border-gray-200 pb-4">
              {COLUMN_GROUP_CONFIG.map((group) => (
                <button
                  key={group.key}
                  onClick={() => setColumnGroup(group.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    columnGroup === group.key
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={currentColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  showAction={false}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold mb-3">
            Feature Importance
          </div>
          <FeatureImportanceSection
            features={features}
            model={model}
            guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model evaluasi kinerja AE."
            guidanceFeature="Klik bar untuk melihat penjelasan fitur."
          />
        </div>
      </div>
    </div>
  );
}