"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/dashboard/SearchBar";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import TabStage from "@/components/dashboard/TabStage";
import Card from "@/components/common/Card";
import Table, { TableColumn } from "@/components/dashboard/Table";
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
  formalScore: number; // 0..100 (dipakai untuk sort kolom Formal Training)
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
  // Tambahan baris untuk simulasi pagination (~50 baris total)
  ...Array.from({ length: 46 }).map((_, i) => {
    const idx = i + 5;
    const id = (21000 + idx).toString();
    return {
      nik: id,
      nama: `AM ${idx}`,
      informal: Math.random() > 0.2 ? "BERIMPACT" : "TIDAK BERIMPACT",
      formalScore: Math.floor(50 + Math.random() * 50),
      year: 2025,
      quarter: "Q1" as Quarter,
      formalDetail: {
        provider: "Internal",
        title: "Sales Skills Refresh",
        hours: 6 + (idx % 5),
        date: "2025-02-20",
        topics: ["Prospecting", "Qualification", "Negotiation"],
      },
    } as Row;
  }),
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

  // Table data
  const [rows, setRows] = useState<Row[]>([]);
  const pageSize = 10;

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
      } catch (e: any) {
        setError(e?.message || "Terjadi kesalahan tak terduga.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [search, year, quarter, searchParams]);

  // Kolom Table (pakai Table.tsx). Sort untuk NIK, Nama, dan Formal Training (pakai formalScore).
  const columns: TableColumn[] = useMemo(
    () => [
      { label: "NIK", key: "nik", sortable: true },
      { label: "Nama", key: "nama", sortable: true },
      { label: "Hasil Informal Training", key: "informal", sortable: false },
      {
        label: "Formal Training",
        key: "formalScore",
        sortable: true, // sort berdasarkan nilai formalScore
        render: (_v, row) => (
          <Button
            variant="tertiary"
            size="table"
            onClick={() => {
              const r = row as Row;
              setDetailOf(r);
              setDetailOpen(true);
            }}
          >
            Detail
          </Button>
        ),
      },
    ],
    []
  );

  // Feature Importance data (sesuai daftar yang diminta)
  const features: Feature[] = useMemo(
    () => [
      { name: "revenue_sales_achievement",   importance: 0.20, description: "Capaian revenue terhadap target penjualan." },
      { name: "sales_achievement",           importance: 0.16, description: "Jumlah penjualan terhadap target." },
      { name: "profitability_achievement",   importance: 0.14, description: "Kontribusi margin/laba terhadap target." },
      { name: "collection_rate_achievement", importance: 0.12, description: "Kinerja collection/payment rate." },
      { name: "am_tools_achievement",        importance: 0.10, description: "Pemakaian tools AM (CRM, funnel, dsb.)." },
      { name: "capability_achievement",      importance: 0.08, description: "Peningkatan kapabilitas/sertifikasi." },
      { name: "behaviour_achievement",       importance: 0.07, description: "Aspek perilaku (discipline, collaboration)." },
      { name: "survey_am_to_consumer",       importance: 0.05, description: "Hasil survei konsumen terhadap AM." },
      { name: "nps",                         importance: 0.04, description: "Net Promoter Score pelanggan." },
      { name: "win_rate",                    importance: 0.025, description: "Rasio kemenangan tender/deal." },
      { name: "tindak_lanjut_evaluasi",      importance: 0.015, description: "Tindak lanjut dari hasil evaluasi." },
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

      {/* Training Table - format sama seperti snippet (pakai Table component) */}
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
                  <Table columns={columns} data={rows} pageSize={pageSize} showAction={false} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold mb-4 ">Feature Importance</div>
          <FeatureImportanceSection
            features={features}
            model={model}
            guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model."
            guidanceFeature="Klik bar untuk melihat penjelasan fitur."
          />
        </div>
      </div>

      {/* Modal Detail Formal Training */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} row={detailOf} />
    </div>
  );
}