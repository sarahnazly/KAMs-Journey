"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import FilterYear from "@/components/dashboard/FilterYear";
import TabStage from "@/components/dashboard/TabStage";
import Table, { TableColumn } from "@/components/dashboard/Table";
import { useRouter } from "next/navigation";

type Row = {
  nik: string;
  name: string;
  score1: number; // Basic Understanding
  score2: number; // Twinning
  score3: number; // Customer Matching
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
};

export default function OrientasiOverviewPage() {
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
      { label: "Name", key: "name", sortable: true },
      { label: "Basic Understanding", key: "score1", sortable: true },
      { label: "Twinning", key: "score2", sortable: true },
      { label: "Customer Matching", key: "score3", sortable: true },
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
        return "/journey/orientasi";
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

    const fetchData = async () => {
      try {
        const quarterParam = `${quarter} ${year}`; 

        const API = process.env.NEXT_PUBLIC_API_BASE_URL;

        const encoded = encodeURIComponent(quarterParam);
        const res = await fetch(`${API}/orientasi/quarter/${encoded}`);

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();

        // map backend data → tabel Row
        const mapped: Row[] = json.map((item: any) => ({
          nik: String(item.nik),
          name: item.name,
          score1: item.basic_understanding,
          score2: item.twinning,
          score3: item.customer_matching != null 
            ? Number((item.customer_matching * 100).toFixed(2)) 
            : 0,
          quarter: quarter,
          year: year,
        }));

        // apply search
        let filtered = mapped;
        if (search) {
          const q = search.toLowerCase();
          filtered = mapped.filter(
            (row) =>
              row.name.toLowerCase().includes(q) ||
              row.nik.includes(search)
          );
        }

        setData(filtered);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quarter, year, search]);


  const handleDetail = (row: Record<string, any>) => {
    const nik = row?.nik;
    if (nik) router.push(`/journey/orientasi/${nik}?quarter=${quarter} ${year}`);
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
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={columns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={10}
                  onDetail={handleDetail}
                  showAction={true}
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}