"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import Table, { TableColumn } from "@/components/dashboard/Table";
import WinProbabilityPopup from "@/components/dashboard/pelaksanaan/WinProbabilityPopup";
import { ArrowLeftIcon, AlertCircle } from "lucide-react";

export default function OnDutyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const nik = params?.nik as string;
  const quarter = searchParams.get("quarter") ?? "Q1 2025";

  const [projects, setProjects] = useState<any[]>([]);
  const [wpMeta, setWpMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const formatRp = (v: number | null | undefined) =>
    "Rp " + (v ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

  const round2 = (v: number | null | undefined) =>
    v == null ? 0 : Number(v.toFixed(2));

  // ------------------------------------------------------
  // FETCH PROJECT LIST + WP per project
  // ------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 1) Load project list
        const resProj = await fetch(
          `http://localhost:8000/project/ae/${nik}/${encodeURIComponent(quarter)}`
        );

        let projList = [];
        if (resProj.status === 404) {
          projList = [];  // treat as empty result set, NOT an error
        } else if (!resProj.ok) {
          throw new Error("Failed loading project data");
        } else {
          projList = await resProj.json();
        }

        // If no project, set empty and stop
        if (projList.length === 0) {
          setProjects([]);
          return;
        }

        // 2) Enrich with Win Probability
        const enriched = [];

        for (const p of projList) {
          const resWP = await fetch(
            `http://localhost:8000/wp/project/${p.lop_id}/${encodeURIComponent(quarter)}`
          );

          const wpData = await resWP.json();
          const prediction = wpData?.data?.[0] ?? null;

          let wpPct = prediction?.win_probability_pct ?? 0;
          wpPct = round2(wpPct);

          if (p.status?.toLowerCase() === "win") wpPct = 100;
          if (p.status?.toLowerCase() === "lose") wpPct = 0;

          const clean = (txt = "") =>
            txt
              .split(",")
              .map((s) =>
                s.replace(/\(.*?\)/g, "").replace("+", "").replace("-", "").trim()
              );

          enriched.push({
            ...p,
            winProbability: wpPct,
            modelLikelihood: prediction?.win_probability_pct ?? 0,
            topPositive: clean(prediction?.top_positive_factors),
            topNegative: clean(prediction?.top_negative_factors),
          });
        }

        setProjects(enriched);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [nik, quarter]);

  // ------------------------------------------------------
  // FETCH WP META (best_model, ACC, etc.)
  // ------------------------------------------------------
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch("http://localhost:8000/wp/all");
        const json = await res.json();
        setWpMeta(json.meta);
      } catch (err) {
        console.error("Failed to load WP meta");
      }
    }
    loadMeta();
  }, []);

  // ------------------------------------------------------
  // TABLE STRUCTURE
  // ------------------------------------------------------
  const columns: TableColumn[] = useMemo(
    () => [
      { label: "Project", key: "project_name", sortable: true },
      { label: "Customer", key: "customer_name", sortable: true },
      {
        label: "Value Project",
        key: "value_projects",
        sortable: true,
        render: (v) => formatRp(v),
      },
      { label: "Stage", key: "stage", sortable: true },
      {
        label: "Jumlah Aktivitas",
        key: "jumlah_aktivitas",
        sortable: true,
        render: (v) => Math.round(v),
      },
      { label: "Status", key: "status", sortable: true },
      {
        label: "Win Probability (%)",
        key: "winProbability",
        sortable: true,
        render: (v) => `${round2(v)}`,
      },
    ],
    []
  );

  // ------------------------------------------------------
  // OPEN POPUP
  // ------------------------------------------------------
  const openPopup = (row: any) => {
    const status = row.status?.toLowerCase();
    const baseLikelihood = row.modelLikelihood ?? 0;

    let probability = row.winProbability;
    let likelihoodLabel: "WIN" | "LOSE" | null = null;
    let likelihoodPct: number | null = null;

    if (status === "win") {
      probability = 100;
      likelihoodLabel = "WIN";
      likelihoodPct = round2(baseLikelihood);
    } else if (status === "lose") {
      probability = 0;
      likelihoodLabel = "LOSE";
      likelihoodPct = round2(baseLikelihood);
    } else {
      probability = round2(baseLikelihood);
      likelihoodLabel = null;
      likelihoodPct = null;
    }

    setSelected({
      projectId: row.lop_id,
      probability: round2(probability),          
      likelihoodLabel,
      likelihoodPct: likelihoodPct !== null ? round2(likelihoodPct) : null,
      topPositive: row.topPositive.slice(0, 3),
      topNegative: row.topNegative.slice(0, 3),
    });

    setPopupOpen(true);
  };


  // ------------------------------------------------------
  // UI — LOADING
  // ------------------------------------------------------
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ------------------------------------------------------
  // UI — ERROR
  // ------------------------------------------------------
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  // ------------------------------------------------------
  // UI — NO PROJECTS
  // ------------------------------------------------------
  if (projects.length === 0) {
    return (
      <div className="w-full px-6 py-8">
        <Button variant="primary" onClick={() => router.back()} className="mb-6">
          <ArrowLeftIcon size={20} className="mr-2" /> Back
        </Button>

        <div className="w-full flex flex-col items-center justify-center py-16 min-h-[350px]">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-[#E2E8F0] p-4 mb-2">
              <AlertCircle size={60} color="#64748B" />
            </div>
            <div className="text-[22px] font-bold text-[#64748B] text-center">
              No Data Yet!
            </div>
            <div className="text-base font-normal text-[#64748B] text-center mb-4">
              No data or result available.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------
  // MAIN UI
  // ------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-6 py-6">
      <Button variant="primary" onClick={() => router.back()} className="mb-6">
        <ArrowLeftIcon size={20} className="mr-2" /> Back
      </Button>

      <h1 className="text-4xl font-bold mb-2">{nik} — Project List</h1>
      <p className="text-gray-600 mb-6">Quarter: {quarter}</p>

      <Table
        columns={columns}
        data={projects}
        pageSize={10}
        onDetail={openPopup}
        actionColumnLabel="Detail"
      />

      {/* POPUP */}
      {selected && wpMeta && (
        <WinProbabilityPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          projectId={selected.projectId}
          winProbability={selected.probability}
          likelihoodLabel={selected.likelihoodLabel}
          likelihoodPct={selected.likelihoodPct}
          factors={[
            { positive: selected.topPositive[0], risk: selected.topNegative[0] },
            { positive: selected.topPositive[1], risk: selected.topNegative[1] },
            { positive: selected.topPositive[2], risk: selected.topNegative[2] },
          ]}
          modelName={wpMeta.best_model}
          modelACC={wpMeta.metrics.ACC}
        />
      )}
    </div>
  );
}
