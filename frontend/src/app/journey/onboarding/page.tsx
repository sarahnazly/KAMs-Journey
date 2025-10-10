"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import FilterYear from "@/components/dashboard/FilterYear";
import TabStage from "@/components/dashboard/TabStage";
import Table, { TableColumn } from "@/components/dashboard/Table";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";

type Row = {
  nik: string;
  nama: string;
  score1: number; // Basic Understanding
  score2: number; // Twinning
  score3: number; // Customer Matching
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
};

export default function OnboardingOverviewPage() {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [year, setYear] = useState<number>(2025);

  // Table state
  const [data, setData] = useState<Row[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Columns (sortable)
  const columns: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Nama", key: "nama", sortable: true },
      { label: "Basic Understanding", key: "score1", sortable: true },
      { label: "Twinning", key: "score2", sortable: true },
      { label: "Customer Matching", key: "score3", sortable: true },
    ],
    []
  );

  // Dummy data simulate API
  const allData: Row[] = useMemo(
    () => [
      { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86, quarter: "Q1", year: 2025 },
      { nik: "20920", nama: "Budi Santoso",       score1: 85, score2: 75, score3: 81, quarter: "Q1", year: 2025 },
      { nik: "20921", nama: "Nicholas Saputra",   score1: 92, score2: 82, score3: 90, quarter: "Q1", year: 2025 },
      { nik: "20922", nama: "Pinky Siwi",         score1: 88, score2: 78, score3: 85, quarter: "Q1", year: 2025 },
      // Duplikat contoh (NIK sama dalam Q1-2025) — akan didedup
      { nik: "20929", nama: "Budi Santoso",       score1: 85, score2: 75, score3: 81, quarter: "Q1", year: 2025 },

      // Kuartal lain (bukan duplikat untuk Q1-2025)
      { nik: "20920", nama: "Budi Santoso",       score1: 85, score2: 75, score3: 81, quarter: "Q2", year: 2025 },
      { nik: "20921", nama: "Nicholas Saputra",   score1: 92, score2: 82, score3: 90, quarter: "Q3", year: 2025 },
      { nik: "20922", nama: "Pinky Siwi",         score1: 88, score2: 78, score3: 85, quarter: "Q4", year: 2025 },

      { nik: "20923", nama: "Anindya Maulida",    score1: 90, score2: 80, score3: 86, quarter: "Q1", year: 2024 },
      { nik: "20924", nama: "Sarah Nazly",        score1: 85, score2: 75, score3: 81, quarter: "Q2", year: 2024 },
      { nik: "20925", nama: "Celina",             score1: 92, score2: 82, score3: 90, quarter: "Q3", year: 2024 },
      { nik: "20926", nama: "Alya Ghina",         score1: 88, score2: 78, score3: 85, quarter: "Q4", year: 2024 },
    ],
    []
  );

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
        return "/journey/onboarding";
    }
  };

  // Dedupe helper: hilangkan data duplikat per NIK pada hasil filter quarter+year
  const dedupeByNik = (rows: Row[]) => {
    const seen = new Set<string>();
    const unique: Row[] = [];
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
      // 1) Filter by quarter + year
      let filtered = allData.filter((row) => row.quarter === quarter && row.year === year);

      // 2) Dedupe by NIK (hanya tampilkan 1 data untuk NIK yang sama dalam periode yang sama)
      filtered = dedupeByNik(filtered);

      // 3) Search (by Name or NIK)
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((row) => row.nama.toLowerCase().includes(q) || row.nik.includes(search));
      }

      setData(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [allData, quarter, year, search]);

  // Detail button -> /journey/onboarding/[nik]
  const handleDetail = (row: Record<string, any>) => {
    const nik = row?.nik;
    if (nik) router.push(`/journey/onboarding/${nik}`);
  };

  // TabStage navigation
  const handleStageChange = (stage: string) => {
    const path = stageToPath(stage);
    router.push(path);
  };

  return (
    <div className="w-full">
      {/* Search + Filters card (mengikuti search-filter-card.tsx) */}
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

      {/* Table align center */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <Card heading="Daftar Account Manager" description="Data Account Manager berdasarkan periode yang dipilih">
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6">
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
          </Card>
        </div>
      </div>
    </div>
  );
}