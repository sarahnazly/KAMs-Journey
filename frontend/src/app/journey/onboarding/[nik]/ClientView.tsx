"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import { Button } from "@/components/common/Button";

type Metric = { title: string; score: number | null; sub: string };
type Detail = {
  name: string;
  basic: { total: number | null; items: Metric[] };
  twinning: { total: number | null; items: Metric[] };
  cm: { total: number | null; items: Metric[] };
  suggestion?: string | null;
};

type Status = "idle" | "loading" | "success" | "error";

function clampPercent(v: number) {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

function scoreColor(score: number | null) {
  if (score === null) return "text-[#94A3B8]"; // abu-abu untuk kosong
  if (score >= 85) return "text-[#065F46]";
  if (score >= 70) return "text-[#F69D17]";
  return "text-[#DC2626]";
}

function ProgressBar({ value, missing }: { value: number | null; missing?: boolean }) {
  const pct = clampPercent(value ?? 0);
  return (
    <div className="w-full h-4 relative" aria-label={missing ? "Belum ada skor" : `Skor ${pct}`}>
      <div className="absolute inset-0 bg-[#CBD5E1] rounded-full" />
      <div
        className={`absolute left-0 top-0 h-4 rounded-full ${missing ? "bg-[#E2E8F0]" : ""}`}
        style={{
          width: `${missing ? 0 : pct}%`,
          background: missing ? undefined : "#16396E",
          boxShadow: missing ? undefined : "0px 4px 10px 2px rgba(98, 187, 250, 0.20)",
        }}
      />
    </div>
  );
}

// Mock fetch detail: contoh berbagai kondisi (sukses, error, missing score)
async function fetchDetail(nik: string): Promise<Detail> {
  // Simulasi delay
  await new Promise((r) => setTimeout(r, 600));

  // Pakai NIK tertentu untuk paksa error/demo
  if (nik === "error") {
    throw new Error("Gagal memuat data dari server");
  }

  // Contoh data dengan beberapa skor null (kosong)
  const directory: Record<string, Detail> = {
    "20919": {
      name: "Ratu Nadya Anjania",
      basic: {
        total: 90,
        items: [
          { title: "Solution", score: 85, sub: "Product knowledge and solution mapping" },
          { title: "Account Profile", score: 78, sub: "Customer profiling and analysis" },
          { title: "Account Plan", score: 50, sub: "Strategic account planning" },
          { title: "Sales Funnel", score: 0, sub: "Pipeline management skills" }, // skor 0
          { title: "Bidding Management", score: 108, sub: "Proposal and bidding expertise" }, // out of range
          { title: "Project Management", score: 90, sub: "Project delivery and control" },
        ],
      },
      twinning: {
        total: 80,
        items: [
          { title: "Customer Introduction", score: 90, sub: "Client relationship introduction" },
          { title: "Visiting Customer", score: 76, sub: "Strategic account planning" },
          { title: "Transfer Customer Knowledge", score: 68, sub: "Knowledge sharing and documentation" },
          { title: "Transfer Customer Documentation", score: 82, sub: "Documentation handover process" },
        ],
      },
      cm: {
        total: null, // total kosong
        items: [{ title: "Customer Matching Score", score: null, sub: "Client relationship introduction" }],
      },
      suggestion: "Perkuat understanding terhadap sales funnel optimization",
    },
  };

  const fallback: Detail = {
    name: "Account Manager",
    basic: {
      total: 82,
      items: [
        { title: "Solution", score: 80, sub: "Product knowledge and solution mapping" },
        { title: "Account Profile", score: 78, sub: "Customer profiling and analysis" },
      ],
    },
    twinning: { total: 79, items: [] }, // contoh array kosong
    cm: { total: 83, items: [{ title: "Customer Matching Score", score: 83, sub: "Client relationship introduction" }] },
    suggestion: null, // tidak ada saran
  };

  const detail = directory[nik] ?? fallback;

  // Contoh duplikasi item -> dedupe by title
  const dedupe = (items: Metric[]) => {
    const seen = new Set<string>();
    return items.filter((i) => (seen.has(i.title) ? false : (seen.add(i.title), true)));
  };

  return {
    ...detail,
    basic: { ...detail.basic, items: dedupe(detail.basic.items ?? []) },
    twinning: { ...detail.twinning, items: dedupe(detail.twinning.items ?? []) },
    cm: { ...detail.cm, items: dedupe(detail.cm.items ?? []) },
  };
}

export default function ClientView({ nik }: { nik: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [detail, setDetail] = useState<Detail | null>(null);

  const load = async () => {
    setStatus("loading");
    setError("");
    try {
      const d = await fetchDetail(nik);
      setDetail(d);
      setStatus("success");
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan saat memuat data.");
      setDetail(null);
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nik]);

  // Loading skeleton sederhana
  if (status === "loading") {
    return (
      <div className="w-full flex flex-col gap-6">
        <div>
          <Button variant="primary" disabled>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Button>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-2/3 bg-slate-200 rounded" />
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
        </div>
        <Card heading={<div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border border-[#CBD5E1] rounded-[10px]">
                <div className="h-4 w-2/3 bg-slate-200 rounded mb-3 animate-pulse" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Error state + Retry
  if (status === "error") {
    return (
      <div className="w-full flex flex-col gap-6">
        <div>
          <Button variant="primary" onClick={() => router.back()}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Button>
        </div>
        <Card heading="Gagal Memuat Data" description="Terjadi kendala saat mengambil data dari server.">
          <div className="text-[#DC2626] mb-4">{error}</div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={load}>
              Coba Lagi
            </Button>
            <Button variant="ghost" onClick={() => router.push("/journey/onboarding")}>
              Kembali ke Daftar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Tidak ada detail (nik tidak ditemukan)
  if (!detail) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div>
          <Button variant="primary" onClick={() => router.back()}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Button>
        </div>
        <Card heading="Data tidak ditemukan">
          <div className="text-[#475569]">Data untuk NIK tersebut tidak tersedia.</div>
          <div className="mt-4">
            <Button variant="primary" onClick={() => router.push("/journey/onboarding")}>
              Kembali ke Daftar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const HeaderWithTotal = (title: string, desc: string, total: number | null) => (
    <div className="flex items-start justify-between w-full">
      <div>
        <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold">{title}</div>
        <div className="text-[#94A3B8] text-[16px]">{desc}</div>
      </div>
      <div className="text-right">
        <div className={`text-[24px] md:text-[28px] font-bold ${scoreColor(total)}`}>{total ?? "—"}</div>
        <div className="text-[#94A3B8] text-[14px]">Total Score</div>
      </div>
    </div>
  );

  const MetricCard = ({ m }: { m: Metric }) => {
    const missing = m.score === null || Number.isNaN(m.score as number);
    const shown = missing ? "—" : clampPercent(m.score as number);
    // Tandai jika skor out-of-range tapi tidak null
    const isOutOfRange = !missing && (m.score! < 0 || m.score! > 100);

    return (
      <div className="w-full bg-white rounded-[10px] border border-[#CBD5E1] p-4 shadow-sm" title={isOutOfRange ? "Skor di luar rentang (0-100) — ditampilkan sebagai persentase terbatas" : undefined}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[#0F172A] text-[18px] font-bold">{m.title}</div>
          <div className={`text-[18px] font-bold ${scoreColor(m.score)}`}>{missing ? "—" : shown}</div>
        </div>
        <ProgressBar value={m.score} missing={missing} />
        <div className="text-[#475569] text-[12px] mt-3">{m.sub}</div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Back */}
      <div>
        <Button variant="primary" onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[#0F172A] text-[40px] md:text-[48px] font-bold leading-[1.2]">
          {nik} - {detail.name}
        </h1>
        <p className="text-[#64748B] text-[18px] md:text-[20px]">Onboarding performance score</p>
      </div>

      {/* Basic Understanding */}
      <Card heading={HeaderWithTotal("Basic Understanding", "Fundamental knowledge and skills assessment", detail.basic.total)}>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {detail.basic.items.length === 0 ? (
            <div className="text-[#64748B]">Belum ada penilaian pada bagian ini.</div>
          ) : (
            detail.basic.items.map((m) => <MetricCard key={m.title} m={m} />)
          )}
        </div>

        {/* Saran Pengembangan (jika ada) */}
        {detail.suggestion ? (
          <div className="mt-5 w-full bg-white rounded-[10px] border border-[#CBD5E1] p-4 shadow-sm">
            <div className="text-[18px] font-bold mb-1 text-black">Saran Pengembangan</div>
            <div className="text-[16px] text-black">{detail.suggestion}</div>
          </div>
        ) : null}
      </Card>

      {/* Twinning */}
      <Card heading={HeaderWithTotal("Twinning", "Mentorship and knowledge transfer evaluation", detail.twinning.total)}>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {detail.twinning.items.length === 0 ? (
            <div className="text-[#64748B]">Belum ada penilaian pada bagian ini.</div>
          ) : (
            detail.twinning.items.map((m) => <MetricCard key={m.title} m={m} />)
          )}
        </div>
      </Card>

      {/* Customer Matching */}
      <Card heading={HeaderWithTotal("Customer Matching", "Customer alignment and relationship assessment", detail.cm.total)}>
        <div className="mt-4 grid grid-cols-1 gap-5">
          {detail.cm.items.length === 0 ? (
            <div className="text-[#64748B]">Belum ada penilaian pada bagian ini.</div>
          ) : (
            detail.cm.items.map((m) => <MetricCard key={m.title} m={m} />)
          )}
        </div>
      </Card>
    </div>
  );
}