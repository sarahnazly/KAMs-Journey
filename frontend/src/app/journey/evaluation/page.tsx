"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterEvaluationCategory from "@/components/dashboard/evaluation/FilterEvaluationCategory";
import MetricCard from "@/components/dashboard/evaluation/MetricCard";
import TabStage from "@/components/dashboard/TabStage";
import Table, { TableColumn } from "@/components/dashboard/Table";
import BehaviorAchievementPopup from "@/components/dashboard/evaluation/BehaviorAchievementPopup";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";
import { Search } from "lucide-react";

type EvaluationRow = {
  nik: string;
  nama: string;
  revenueAch: string;
  salesAch: string;
  profitabilityAch: string;
  collectionRateAch: string;
  amToolsAch: string;
  capabilityAch: string;
  behaviorAch: string;
  surveyAMConsumer: string;
  nps: number;
  winRate: string;
  predictions: string;
  evaluationCategory: string;
  evaluationRemarks: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
};

interface BehaviorAchievementData {
  no: number;
  assessmentTime: string;
  score: number;
}

export default function EvaluationOverviewPage() {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [year, setYear] = useState<number>(2025);
  const [category, setCategory] = useState<string>("All");

  // Table state
  const [data, setData] = useState<EvaluationRow[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Behavior Achievement Popup state
  const [behaviorPopupOpen, setBehaviorPopupOpen] = useState<boolean>(false);
  const [behaviorPopupData, setBehaviorPopupData] = useState<BehaviorAchievementData[]>([]);
  const [behaviorPopupLoading, setBehaviorPopupLoading] = useState<boolean>(false);
  const [behaviorPopupError, setBehaviorPopupError] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<{ name: string; nik: string }>({ name: "", nik: "" });

  // Dummy data
  const allData: EvaluationRow[] = useMemo(
    () => [
      {
        nik: "20919",
        nama: "Ratu Nadya Anjania",
        revenueAch: "80%",
        salesAch: "80%",
        profitabilityAch: "80%",
        collectionRateAch: "70%",
        amToolsAch: "75%",
        capabilityAch: "55%",
        behaviorAch: "detail",
        surveyAMConsumer: "detail",
        nps: 9,
        winRate: "95%",
        predictions: "detail",
        evaluationCategory: "Melanjutkan",
        evaluationRemarks: "Win Rate tinggi",
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20971",
        nama: "Sarah Nazly Nuraya",
        revenueAch: "80%",
        salesAch: "80%",
        profitabilityAch: "80%",
        collectionRateAch: "75%",
        amToolsAch: "80%",
        capabilityAch: "55%",
        behaviorAch: "detail",
        surveyAMConsumer: "detail",
        nps: 10,
        winRate: "95%",
        predictions: "detail",
        evaluationCategory: "Melanjutkan",
        evaluationRemarks: "Relasi kuat",
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20984",
        nama: "Anindya Maulida Widyatmoko",
        revenueAch: "80%",
        salesAch: "80%",
        profitabilityAch: "80%",
        collectionRateAch: "80%",
        amToolsAch: "78%",
        capabilityAch: "55%",
        behaviorAch: "detail",
        surveyAMConsumer: "detail",
        nps: 9,
        winRate: "95%",
        predictions: "detail",
        evaluationCategory: "Perlu Pengembangan Kompetensi",
        evaluationRemarks: "Kompeten tapi perlu ditingkatkan",
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20992",
        nama: "John Doe",
        revenueAch: "80%",
        salesAch: "80%",
        profitabilityAch: "80%",
        collectionRateAch: "65%",
        amToolsAch: "80%",
        capabilityAch: "55%",
        behaviorAch: "detail",
        surveyAMConsumer: "detail",
        nps: 6,
        winRate: "95%",
        predictions: "detail",
        evaluationCategory: "SP 3",
        evaluationRemarks: "Kurang pemahaman",
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20993",
        nama: "Jane Smith",
        revenueAch: "85%",
        salesAch: "85%",
        profitabilityAch: "85%",
        collectionRateAch: "80%",
        amToolsAch: "85%",
        capabilityAch: "60%",
        behaviorAch: "detail",
        surveyAMConsumer: "detail",
        nps: 8,
        winRate: "90%",
        predictions: "detail",
        evaluationCategory: "SP 1",
        evaluationRemarks: "Perlu peningkatan",
        quarter: "Q1",
        year: 2025,
      },
      {
        nik: "20994",
        nama: "Ahmad Yani",
        revenueAch: "60%",
        salesAch: "60%",
        profitabilityAch: "60%",
        collectionRateAch: "50%",
        amToolsAch: "55%",
        capabilityAch: "40%",
        behaviorAch: "detail",
        surveyAMConsumer: "detail",
        nps: 4,
        winRate: "60%",
        predictions: "detail",
        evaluationCategory: "Diberhentikan",
        evaluationRemarks: "Performa tidak memenuhi target",
        quarter: "Q1",
        year: 2025,
      },
    ],
    []
  );

  // Dummy Behavior Achievement Data Generator
  const generateBehaviorData = (nik: string): BehaviorAchievementData[] => {
    // Simulate different data for different employees
    const baseScore = parseInt(nik.slice(-2));
    return [
      { no: 1, assessmentTime: "2025-01-15", score: baseScore + 5 },
      { no: 2, assessmentTime: "2025-02-20", score: baseScore + 8 },
      { no: 3, assessmentTime: "2025-03-10", score: baseScore + 3 },
      { no: 4, assessmentTime: "2025-04-25", score: baseScore + 7 },
      { no: 5, assessmentTime: "2025-05-18", score: baseScore + 6 },
    ];
  };

  // Map stage TabStage -> route
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
        return "/journey/evaluation";
    }
  };

  // Dedupe helper
  const dedupeByNik = (rows: EvaluationRow[]) => {
    const seen = new Set<string>();
    const unique: EvaluationRow[] = [];
    for (const r of rows) {
      if (!seen.has(r.nik)) {
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
      let filtered = allData.filter((row) => row.quarter === quarter && row.year === year);
      filtered = dedupeByNik(filtered);

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (row) => row.nama.toLowerCase().includes(q) || row.nik.includes(search)
        );
      }

      if (category !== "All") {
        filtered = filtered.filter((row) => row.evaluationCategory === category);
      }

      setData(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [allData, quarter, year, search, category]);

  // Handle Behavior Achievement Detail Click
  const handleBehaviorDetailClick = (row: Record<string, any>) => {
    setSelectedEmployee({ name: row.nama, nik: row.nik });
    setBehaviorPopupOpen(true);
    setBehaviorPopupLoading(true);
    setBehaviorPopupError("");

    // Simulate API call
    setTimeout(() => {
      try {
        const behaviorData = generateBehaviorData(row.nik);
        setBehaviorPopupData(behaviorData);
        setBehaviorPopupLoading(false);
      } catch (err) {
        setBehaviorPopupError("Failed to load behavior achievement data");
        setBehaviorPopupLoading(false);
      }
    }, 800);
  };

  // Detail button handlers
  const handleDetailClick = (type: string, row: Record<string, any>) => {
    if (type === "behavior") {
      handleBehaviorDetailClick(row);
    } else {
      console.log(`${type} clicked for:`, row);
      // TODO: Add navigation logic for other types here, e.g.: survey, predictions
    }
  };

  // TabStage navigation
  const handleStageChange = (stage: string) => {
    const path = stageToPath(stage);
    router.push(path);
  };

  // Define table columns
  const evaluationColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { 
      label: "Revenue Ach.", 
      key: "revenueAch", 
      sortable: true
    },
    { 
      label: "Sales Ach.", 
      key: "salesAch", 
      sortable: true
    },
    { 
      label: "Profitability Ach.", 
      key: "profitabilityAch", 
      sortable: true
    },
    { 
      label: "Collection Rate Ach.", 
      key: "collectionRateAch", 
      sortable: true
    },
    { 
      label: "AM Tools Ach.", 
      key: "amToolsAch", 
      sortable: true
    },
    { 
      label: "Capability Ach.", 
      key: "capabilityAch", 
      sortable: true
    },
    { 
      label: "Behavior Ach.", 
      key: "behaviorAch", 
      sortable: false,
      render: (value, row) => (
        <button
          onClick={() => handleDetailClick("behavior", row)}
          className="text-[#1464D5] hover:text-[#0D4BA6] transition-colors flex items-center justify-center mx-auto"
          title="View Behavior Achievement Details"
        >
          <Search size={16} />
        </button>
      )
    },
    { 
      label: "Survey AM to Consumer", 
      key: "surveyAMConsumer", 
      sortable: false,
      render: (value, row) => (
        <button
          onClick={() => handleDetailClick("survey", row)}
          className="text-[#1464D5] hover:text-[#0D4BA6] transition-colors flex items-center justify-center mx-auto"
          title="View Survey Details"
        >
          <Search size={16} />
        </button>
      )
    },
    { label: "NPS", key: "nps", sortable: true },
    { 
      label: "Win Rate", 
      key: "winRate", 
      sortable: true
    },
    { 
      label: "Predictions", 
      key: "predictions", 
      sortable: false,
      render: (value, row) => (
        <button
          onClick={() => handleDetailClick("predictions", row)}
          className="text-[#1464D5] hover:text-[#0D4BA6] transition-colors flex items-center justify-center mx-auto"
          title="View Predictions"
        >
          <Search size={16} />
        </button>
      )
    },
    { label: "Evaluation Category", key: "evaluationCategory", sortable: true },
    { label: "Evaluation Remarks", key: "evaluationRemarks", sortable: true },
  ];

  // Feature Importance data
  const features: Feature[] = useMemo(
    () => [
      { name: "revenue", importance: 0.35, description: "Keseluruhan pendapatan KAM per kuartal." },
      { name: "profitability", importance: 0.30, description: "Keseluruhan profitabilitas KAM per kuartal." },
      { name: "collection_rate", importance: 0.25, description: "Jumlah persentase pembayaran oleh pelanggan KAM." },
      { name: "customer", importance: 0.15, description: "Jumlah pelanggan yang ditangani oleh KAM." },
      { name: "cnq_test", importance: 0.10, description: "Hasil CnQ test setelah performansi" },
      { name: "behaviour", importance: 0.08, description: "Penilaian perilaku KAM berdasarkan survei." },
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
              Search KAMs
            </div>
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
                <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as any)} />
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
          <MetricCard label="Avg. Revenue Achievement" value="92%" />
          <MetricCard label="Avg. NPS" value="+45" />
          <MetricCard label="Avg. Win Rate" value="78%" />
          <MetricCard label="Avg. Behavior Score" value="85/100" />
        </div>
      </div>

      {/* Performance Evaluation Card */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card
            heading="Performance Evaluation"
            description="Assessing employee metrics and follow-up details"
          >
            {/* Evaluation Category Filter */}
            <div className="mb-4">
              <div className="text-black text-[16px] font-semibold leading-[24px] mt-2 mb-1">
                Evaluation Category
              </div>
              <FilterEvaluationCategory value={category} onChange={setCategory} />
            </div>

            {/* Table */}
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={evaluationColumns}
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
            guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model evaluasi kinerja KAM."
            guidanceFeature="Klik bar untuk melihat penjelasan fitur."
          />
        </div>
      </div>

      {/* Behavior Achievement Popup */}
      <BehaviorAchievementPopup
        isOpen={behaviorPopupOpen}
        onClose={() => setBehaviorPopupOpen(false)}
        employeeName={selectedEmployee.name}
        employeeNIK={selectedEmployee.nik}
        data={behaviorPopupData}
        loading={behaviorPopupLoading}
        error={behaviorPopupError}
      />
    </div>
  );
}