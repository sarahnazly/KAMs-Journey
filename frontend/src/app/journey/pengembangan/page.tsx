"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "@/components/dashboard/SearchBar";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import TabStage from "@/components/dashboard/TabStage";
import Card from "@/components/common/Card";
import Table, { TableColumn } from "@/components/dashboard/Table";
import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";

const stageToPath = (stage: string) => {
  switch (stage) {
    case "Orientasi": return "/journey/orientasi";
    case "Pelaksanaan": return "/journey/pelaksanaan";
    case "Kinerja": return "/journey/kinerja";
    case "Evaluasi": return "/journey/evaluasi";
    case "Pengembangan": return "/journey/pengembangan";
    default: return "/journey/pengembangan";
  }
};

const coachingMap = (v: number) => `F${Math.round(v)}`;

export default function PengembanganPage(): JSX.Element {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [year, setYear] = useState(2025);
  const [quarter, setQuarter] = useState<"Q1"|"Q2"|"Q3"|"Q4">("Q1");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [informalRows, setInformalRows] = useState<any[]>([]);
  const [formalRows, setFormalRows] = useState<any[]>([]);

  const [fiFeatures, setFiFeatures] = useState<Feature[]>([]);
  const [fiModel, setFiModel] = useState<ModelInfo | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const q = encodeURIComponent(`${quarter} ${year}`);
        const res = await fetch(`http://localhost:8000/pengembangan/${q}`);

        if (!res.ok) throw new Error("Failed fetching pengembangan data");

        const data = await res.json();

        const informal = [];
        const formal = [];

        for (const row of data) {
          informal.push({
            nik: row.nik,
            name: row.name,
            informalCoaching: coachingMap(row.coaching_result_informal),
            informalLesson: row.lesson_learned_informal,
          });

          formal.push({
            nik: row.nik,
            name: row.name,
            courseName: row.course_name,
            certificateId: row.certificate_id,
            formalCoaching: coachingMap(row.coaching_result_formal),
            formalLesson: row.lesson_learned_formal,
          });
        }

        /* Search filtering */
        const qLower = search.toLowerCase();
        const filteredInformal = informal.filter(r =>
          r.nik.toString().includes(search) || r.name.toLowerCase().includes(qLower)
        );
        const filteredFormal = formal.filter(r =>
          r.nik.toString().includes(search) || r.name.toLowerCase().includes(qLower)
        );

        setInformalRows(filteredInformal);
        setFormalRows(filteredFormal);

      } catch (e: any) {
        setError(e.message);
        setInformalRows([]);
        setFormalRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [search, year, quarter]);

  useEffect(() => {
    async function loadFI() {
      try {
        const q = encodeURIComponent(`${quarter} ${year}`);
        const res = await fetch(`http://localhost:8000/fi/evaluasi_to_pengembangan/${q}`);

        if (!res.ok) throw new Error("Failed fetching FI");

        const json = await res.json();

        const meta = json.meta;
        const feats = json.features;

        const fiList: Feature[] = feats.map((f: any) => ({
          name: f.feature,
          importance: Number(f.importance),
          description: f.description ?? "-",
        }));

        setFiFeatures(fiList);

        setFiModel({
          name: meta.best_regressor,
          R2: Number(meta.metrics_overall.R2),
          trainCount: 700,
        });
      } catch (err) {
        console.log("FI Error:", err);
      }
    }

    loadFI();
  }, [quarter, year]);

  const informalCols: TableColumn[] = useMemo(() => [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    { label: "Hasil Coaching", key: "informalCoaching", sortable: true },
    { label: "Lesson Learned", key: "informalLesson", sortable: false },
  ], []);

  const formalCols: TableColumn[] = useMemo(() => [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    { label: "Course Name", key: "courseName", sortable: true },
    { label: "Certificate ID", key: "certificateId", sortable: true },
    { label: "Hasil Coaching", key: "formalCoaching", sortable: true },
    { label: "Lesson Learned", key: "formalLesson", sortable: false },
  ], []);

  return (
    <div className="w-full flex flex-col gap-6">

      {/* SEARCH + FILTERS */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]">
          <div className="flex-1 flex flex-col items-start">
            <div className="text-[20px] font-semibold">Search Account Executive</div>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-[200px]">
              <div className="font-semibold">Tahun</div>
              <FilterYear value={year} onChange={setYear} />
            </div>

            <div className="w-[200px]">
              <div className="font-semibold">Periode</div>
              <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as any)} />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full flex justify-center">
          <TabStage onStageChange={(s) => router.push(stageToPath(s))} />
        </div>
      </div>

      {/* INFORMAL LEARNING TABLE */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Informal Learning" description="Tracking and evaluation of AE informal learning">
            <div className="px-4 mt-4">
              <Table
                columns={informalCols}
                data={informalRows}
                loading={loading}
                error={error}
                pageSize={10}
                showAction={false}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* FORMAL LEARNING TABLE */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full">
          <Card heading="Formal Learning" description="Monitoring AE certifications & course learning">
            <div className="px-4 mt-4">
              <Table
                columns={formalCols}
                data={formalRows}
                loading={loading}
                error={error}
                pageSize={10}
                showAction={false}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* FEATURE IMPORTANCE */}
      <div className="w-full flex justify-center mb-16">
        <div className="max-w-[1100px] w-full">
          <div className="text-[24px] font-bold mb-3">Feature Importance</div>

          {fiModel && (
            <FeatureImportanceSection
              features={fiFeatures}
              model={fiModel}
              guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model."
              guidanceFeature="Klik bar untuk melihat penjelasan fitur."
            />
          )}
        </div>
      </div>

    </div>
  );
}
