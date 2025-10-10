"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/dashboard/SearchBar";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import TabStage from "@/components/dashboard/TabStage";
import Card from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

type Row = {
  nik: string;
  nama: string;
  informal: "BERIMPACT" | "TIDAK BERIMPACT";
  formalScore: number; 
  year: number;
  quarter: Quarter;
  formalDetail: {
    provider: string;
    title: string;
    hours: number;
    date: string;
    certificateId?: string;
    topics: string[];
  };
};

type SortKey = "nik" | "nama" | "formalScore";
type SortDir = "asc" | "desc";

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
      return "/journey/development";
  }
};

// Mock data (ganti ke fetch API jika tersedia)
const ALL_ROWS: Row[] = [
  {
    nik: "20919",
    nama: "Ratu Nadya Anjania",
    informal: "BERIMPACT",
    formalScore: 92,
    year: 2025,
    quarter: "Q1",
    formalDetail: {
      provider: "Dicoding",
      title: "Project Management Fundamentals",
      hours: 24,
      date: "2025-01-22",
      certificateId: "PMF-20919-2025-01",
      topics: ["Scope", "Timeline", "Risk"],
    },
  },
  {
    nik: "20971",
    nama: "Sarah Nazly Nuraya",
    informal: "BERIMPACT",
    formalScore: 88,
    year: 2025,
    quarter: "Q1",
    formalDetail: {
      provider: "Coursera",
      title: "Customer Success 101",
      hours: 18,
      date: "2025-02-03",
      certificateId: "CS-20971-2025-02",
      topics: ["Onboarding", "Adoption", "Renewal"],
    },
  },
  {
    nik: "20984",
    nama: "Anindya Maulida Widyatmoko",
    informal: "BERIMPACT",
    formalScore: 76,
    year: 2025,
    quarter: "Q1",
    formalDetail: {
      provider: "Udemy",
      title: "Solution Selling",
      hours: 12,
      date: "2025-02-11",
      topics: ["Discovery", "Objection Handling", "Closing"],
    },
  },
  {
    nik: "20992",
    nama: "John Doe",
    informal: "TIDAK BERIMPACT",
    formalScore: 55,
    year: 2025,
    quarter: "Q1",
    formalDetail: {
      provider: "Internal",
      title: "Bid & Proposal Basics",
      hours: 8,
      date: "2025-03-01",
      topics: ["RFP", "Compliance", "Pricing"],
    },
  },
];

export default function DevelopmentPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number>(2025);
  const [quarter, setQuarter] = useState<Quarter>("Q1");

  // Loading + error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Table state
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // Sorting (NIK, Nama, skor/Formal Training)
  const [sortKey, setSortKey] = useState<SortKey>("nik");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Modal detail formal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOf, setDetailOf] = useState<Row | null>(null);

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

        let filtered = ALL_ROWS.filter((r) => r.year === year && r.quarter === quarter);
        if (search.trim()) {
          const q = search.toLowerCase();
          filtered = filtered.filter((r) => r.nik.includes(search) || r.nama.toLowerCase().includes(q));
        }

        setRows(filtered);
        setPage(1);
      } catch (e: any) {
        setError(e?.message || "Terjadi kesalahan tak terduga.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [search, year, quarter, searchParams]);

  // Sorting
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  // Pagination
  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const toggleSort = (key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return key;
    });
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
    <span className="ml-1">
      {dir === "asc" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 6L11 9H5L8 6Z" fill={active ? "#fff" : "#CBD5E1"} />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 10L5 7H11L8 10Z" fill={active ? "#fff" : "#CBD5E1"} />
        </svg>
      )}
    </span>
  );

  const Pagination = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    const isPrevDisabled = page <= 1 || totalPages <= 1;
    const isNextDisabled = page >= totalPages || totalPages <= 1;

    return (
      <div className="flex flex-row items-center gap-2 select-none">
        <button
          type="button"
          className="p-2 bg-[#F1F5F9] rounded-full flex items-center justify-center disabled:opacity-50"
          disabled={isPrevDisabled}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          aria-label="Prev"
          title="Previous page"
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M11 13L6 8L11 3" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {pages.map((p, idx) =>
          typeof p === "number" ? (
            <button
              type="button"
              key={p}
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-inter text-[11px] font-semibold transition
                ${p === page ? "bg-[#0F124A] text-white" : "bg-[#E2E8F0] text-[#0F172A]"}
              `}
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ) : (
            <span
              key={`ellipsis-${idx}`}
              className="w-[30px] h-[30px] flex items-center justify-center text-[#0F172A] font-inter text-[11px]"
              style={{ fontFamily: "Figtree, Inter" }}
            >
              ...
            </span>
          )
        )}

        <button
          type="button"
          className="p-2 bg-[#E2E8F0] rounded-full flex items-center justify-center disabled:opacity-50"
          disabled={isNextDisabled}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next"
          title="Next page"
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M5 3L10 8L5 13" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  };

  // Feature Importance data dari field yang diminta
  const features: Feature[] = useMemo(
    () => [
      { name: "revenue_sales_achievement",   importance: 0.20, description: "Capaian revenue terhadap target penjualan." },
      { name: "sales_achievement",           importance: 0.16, description: "Capaian jumlah penjualan (unit/deal) terhadap target." },
      { name: "profitability_achievement",   importance: 0.14, description: "Kontribusi margin/laba terhadap target profitabilitas." },
      { name: "collection_rate_achievement", importance: 0.12, description: "Kinerja collection/payment rate." },
      { name: "am_tools_achievement",        importance: 0.10, description: "Pemanfaatan tools internal AM (CRM, funnel, dsb.)." },
      { name: "capability_achievement",      importance: 0.08, description: "Peningkatan kapabilitas (skills/sertifikasi)." },
      { name: "behaviour_achievement",       importance: 0.07, description: "Aspek perilaku (discipline, collaboration, initiative)." },
      { name: "survey_am_to_consumer",       importance: 0.05, description: "Hasil survei konsumen terhadap AM." },
      { name: "nps",                         importance: 0.04, description: "Net Promoter Score dari pelanggan." },
      { name: "win_rate",                    importance: 0.025, description: "Rasio kemenangan tender/deal." },
      { name: "tindak_lanjut_evaluasi",      importance: 0.015, description: "Tindak lanjut dari hasil evaluasi sebelumnya." },
    ],
    []
  );

  const model: ModelInfo = useMemo(
    () => ({ name: "XGBoost", accuracy: 0.85, trainCount: 500 }),
    []
  );

  // Modal Detail Formal Training
  const Modal = ({ open, onClose, row }: { open: boolean; onClose: () => void; row: Row | null }) => {
    if (!open || !row) return null;
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[90vw] bg-white rounded-2xl border border-[#CBD5E1] shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[20px] font-bold text-[#0F172A]">Detail Formal Training</div>
              <div className="text-[14px] text-[#64748B]">{row.nik} — {row.nama}</div>
            </div>
            <button onClick={onClose} aria-label="Close" className="text-[#0F172A] hover:text-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[14px]">
            <div className="text-[#64748B]">Provider</div><div className="text-[#0F172A] font-medium">{row.formalDetail.provider}</div>
            <div className="text-[#64748B]">Title</div><div className="text-[#0F172A] font-medium">{row.formalDetail.title}</div>
            <div className="text-[#64748B]">Hours</div><div className="text-[#0F172A] font-medium">{row.formalDetail.hours} jam</div>
            <div className="text-[#64748B]">Date</div><div className="text-[#0F172A] font-medium">{row.formalDetail.date}</div>
            <div className="text-[#64748B]">Certificate</div><div className="text-[#0F172A] font-medium">{row.formalDetail.certificateId ?? "-"}</div>
            <div className="col-span-2">
              <div className="text-[#64748B] mb-1">Topics</div>
              <div className="flex flex-wrap gap-2">
                {row.formalDetail.topics.map((t, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-[#E9F3FF] text-[#164E9D] text-[12px]">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={onClose}>Tutup</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search + Filters */}
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

      {/* Tabs */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Training table */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Training" description="Tracking and evaluation of AM training and certifications">
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
            ) : rows.length === 0 ? (
              <div className="w-full min-h-[140px] flex items-center justify-center text-[#64748B]">
                Tidak ada data untuk filter yang dipilih.
              </div>
            ) : (
              <div className="-mx-4 sm:-mx-6 md:-mx-8">
                <div className="px-2 sm:px-4 md:px-6 mt-4">
                  <div className="w-full overflow-x-auto">
                    <table className="min-w-full table-auto font-inter">
                      <thead>
                        <tr>
                          {[
                            { label: "NIK", key: "nik" as SortKey, sortable: true },
                            { label: "Nama", key: "nama" as SortKey, sortable: true },
                            { label: "Hasil Informal Training", key: "informal" as SortKey, sortable: false },
                            { label: "Formal Training", key: "formalScore" as SortKey, sortable: true },
                          ].map((col, idx, arr) => (
                            <th
                              key={col.label}
                              className="py-5 px-3 text-center text-[15px] font-bold text-white bg-[#02214C] select-none"
                              style={{
                                fontFamily: "Inter, Arial, Helvetica, sans-serif",
                                lineHeight: "19.2px",
                                fontWeight: 700,
                                borderTopLeftRadius: idx === 0 ? 5 : 0,
                                borderTopRightRadius: idx === arr.length - 1 ? 5 : 0,
                                cursor: col.sortable ? "pointer" : "default",
                              }}
                              onClick={() => col.sortable && toggleSort(col.key)}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span>{col.label}</span>
                                {col.sortable && (
                                  <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDir : "asc"} />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map((r, idx) => (
                          <tr key={r.nik} className={`${idx % 2 === 1 ? "bg-[#f1f5f9]" : "bg-white"}`}>
                            <td className="px-3 py-5 text-[15px] text-[#363B3F] text-center font-medium">{r.nik}</td>
                            <td className="px-3 py-5 text-[15px] text-[#363B3F] text-center font-medium">{r.nama}</td>
                            <td className="px-3 py-5 text-[15px] text-[#363B3F] text-center font-medium">
                              {r.informal}
                            </td>
                            <td className="px-3 py-5 text-center align-middle">
                              <Button
                                variant="tertiary"
                                size="table"
                                onClick={() => {
                                  setDetailOf(r);
                                  setDetailOpen(true);
                                }}
                              >
                                Detail
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex flex-row justify-between items-center mt-4 px-1">
                      <div className="text-xs text-[#637381] font-inter">
                        Show {paged.length} from {total} data
                      </div>
                      <Pagination />
                    </div>
                  </div>
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

      {/* Modal Detail */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} row={detailOf} />
    </div>
  );
}