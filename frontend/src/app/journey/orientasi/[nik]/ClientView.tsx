"use client";

import { useSearchParams } from "next/navigation";
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

async function fetchDetailFromAPI(nik: string, quarter: string): Promise<Detail> {
  const encodedQuarter = encodeURIComponent(quarter);

  const res = await fetch(`http://localhost:8000/orientasi/nik/${nik}/quarter/${encodedQuarter}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat data dari server");
  }

  const o = await res.json();

  // Hitung total
  const basicItems = [
    { title: "Solution", score: o.solution, sub: "Product knowledge and solution mapping" },
    { title: "Account Profile", score: o.account_profile, sub: "Customer profiling and analysis" },
    { title: "Account Plan", score: o.account_plan, sub: "Strategic account planning" },
    { title: "Sales Funnel", score: o.sales_funnel, sub: "Pipeline management skills" },
    { title: "Bidding Management", score: o.bidding_management, sub: "Proposal and bidding expertise" },
    { title: "Project Management", score: o.project_management, sub: "Project delivery and control" },
  ];

  const twinningItems = [
    { title: "Customer Introduction", score: o.customer_introduction, sub: "Client relationship introduction" },
    { title: "Visiting Customer", score: o.visiting_customer, sub: "Customer visitation effectiveness" },
    { title: "Transfer Customer Knowledge", score: o.transfer_customer_knowledge, sub: "Knowledge sharing readiness" },
    { title: "Transfer Customer Documentation", score: o.transfer_customer_documentation, sub: "Documentation delivery consistency" },
  ];

  const cmItems = [
    { 
      title: "Customer Matching Score", 
      score: o.customer_matching, 
      sub: "Customer alignment with account strategy" 
    },
  ];

  const basicTotal = basicItems.reduce((acc, m) => acc + (m.score ?? 0), 0) / basicItems.length;
  const twinningTotal = twinningItems.reduce((acc, m) => acc + (m.score ?? 0), 0) / twinningItems.length;

  return {
    name: o.name,
    suggestion: o.saran_pengembangan ?? null,
    basic: { total: Number(basicTotal.toFixed(2)), items: basicItems },
    twinning: { total: Number(twinningTotal.toFixed(2)), items: twinningItems },
    cm: { total: o.customer_matching ?? null, items: cmItems },
  };
}


export default function ClientView({ nik }: { nik: string }) {
  const searchParams = useSearchParams();
  const quarter = searchParams.get("quarter") ?? "";
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [detail, setDetail] = useState<Detail | null>(null);

  const load = async () => {
    setStatus("loading");
    setError("");
    try {
      const d = await fetchDetailFromAPI(nik, quarter);
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
  }, [nik, quarter]);

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
            <Button variant="ghost" onClick={() => router.push("/journey/orientasi")}>
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
            <Button variant="primary" onClick={() => router.push("/journey/orientasi")}>
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
        <p className="text-[#64748B] text-[18px] md:text-[20px]">Orientation performance score</p>
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