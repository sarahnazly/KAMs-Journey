"use client";

import React, { useState, useMemo, useEffect, useRef, JSX } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartOptions,
  ChartData,
  ScriptableContext,
} from "chart.js";
import { Button } from "@/components/common/Button";
import InfoAlert from "@/components/dashboard/InfoAlert";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export interface Feature {
  name: string;
  importance: number;
  description: string;
}
export interface ModelInfo {
  name: string;
  accuracy: number;   // 0..1
  trainCount: number;
}
export interface FeatureImportanceProps {
  features: Feature[];
  model: ModelInfo;
  guidanceFeatureImportance: string;
  guidanceFeature: string;
  className?: string;
}

const BAR_HEIGHT = 28;
const BAR_GAP = 20;
const BAR_RADIUS = 4;
const ROW_H = BAR_HEIGHT + BAR_GAP; 
const INNER_PADDING = 60; 

export default function FeatureImportanceSection({
  features,
  model,
  guidanceFeatureImportance,
  guidanceFeature,
  className = "",
}: FeatureImportanceProps): JSX.Element {
  const [showGuidance, setShowGuidance] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Pakai font Inter dari CSS variable (Next.js next/font)
  const chartFontFamily = useMemo(() => {
    if (typeof window === "undefined") return "Inter, Arial, Helvetica, sans-serif";
    const cssVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-inter")
      .replace(/["']/g, "")
      .trim();
    return cssVar ? `${cssVar}, Inter, Arial, Helvetica, sans-serif` : "Inter, Arial, Helvetica, sans-serif";
  }, []);

  // Set defaults Chart.js ke Inter agar konsisten
  useEffect(() => {
    ChartJS.defaults.font.family = chartFontFamily;
  }, [chartFontFamily]);

  const sorted = useMemo(() => [...features].sort((a, b) => b.importance - a.importance), [features]);
  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);
  const displayed = seeMore ? sorted : top5;

  const chartRef = useRef<any>(null);
  useEffect(() => {
    chartRef.current?.update();
  }, [displayed, showGuidance, selectedIdx]);

  const chartKey = useMemo(
    () => `${displayed.length}-${showGuidance}-${selectedIdx ?? "none"}`,
    [displayed.length, showGuidance, selectedIdx]
  );

  const chartData: ChartData<"bar"> = useMemo(
    () => ({
      labels: displayed.map((f) => f.name),
      datasets: [
        {
          data: displayed.map((f) => f.importance),
          borderWidth: 0,
          borderRadius: BAR_RADIUS,
          backgroundColor: (ctx: ScriptableContext<"bar">) => {
            const { ctx: canvasCtx } = ctx.chart;
            const idx = ctx.dataIndex;

            const grad = (from: string, to: string) => {
              const g = canvasCtx.createLinearGradient(0, 0, 0, BAR_HEIGHT);
              g.addColorStop(0, from);
              g.addColorStop(1, to);
              return g;
            };

            if (showGuidance && selectedIdx !== null) {
              if (idx === selectedIdx) return grad("rgba(0,124,225,0.85)", "rgba(132,180,220,0.65)");
              return grad("#CBD5E1", "#CBD5E1"); // non-selected -> abu
            }
            return grad("rgba(0,124,225,0.85)", "rgba(132,180,220,0.65)");
          },
          hoverBackgroundColor: (ctx: ScriptableContext<"bar">) => {
            const { ctx: canvasCtx } = ctx.chart;
            const g = canvasCtx.createLinearGradient(0, 0, 0, BAR_HEIGHT);
            g.addColorStop(0, "rgba(0,124,225,1)");
            g.addColorStop(1, "rgba(132,180,220,0.85)");
            return g;
          },
          barThickness: BAR_HEIGHT,
          categoryPercentage: 0.48,
          barPercentage: 0.9,
        },
      ],
    }),
    [displayed, showGuidance, selectedIdx]
  );

  const chartOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: BAR_GAP / 2,   
          bottom: BAR_GAP / 2,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          titleFont: { family: chartFontFamily, size: 13 },
          bodyFont: { family: chartFontFamily, size: 13 },
          callbacks: {
            label: (ctx) => `${ctx.dataset.label || ""} ${ctx.parsed.x.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: Math.max(...displayed.map((f) => f.importance), 0.4),
          ticks: {
            color: "#607B96",
            font: { size: 13, family: chartFontFamily },
            stepSize: 0.05,
            callback: (val) => (typeof val === "number" ? val.toFixed(2) : val),
          },
          grid: { color: "#E5E7EB" },
          border: { color: "#E5E7EB" },
        },
        y: {
          ticks: {
            color: "#23385B",
            font: { size: 15, family: chartFontFamily, weight: "bold" as const },
          },
          grid: { color: "#E5E7EB" },
          border: { color: "#E5E7EB" },
        },
      },
      onClick: (_e, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          if (showGuidance && selectedIdx === idx) {
            setShowGuidance(false);
            setSelectedIdx(null);
          } else {
            setShowGuidance(true);
            setSelectedIdx(idx);
          }
        }
      },
      animation: { duration: 0 },
    }),
    [displayed, showGuidance, selectedIdx, chartFontFamily]
  );

  useEffect(() => {
    if (!showGuidance) setSelectedIdx(null);
  }, [showGuidance]);

  useEffect(() => {
    if (selectedIdx !== null && selectedIdx >= displayed.length) {
      setSelectedIdx(null);
      setShowGuidance(false);
    }
  }, [displayed.length, selectedIdx]);

  const chartHeight = displayed.length * ROW_H;

  return (
    <section className={className} style={{ fontFamily: chartFontFamily }}>
      <InfoAlert
        title="Model Information"
        className="mb-4 max-w-none"
        message={
          <>
            This prediction uses <b>{model.name}</b> algorithm with{" "}
            <b>{(model.accuracy * 100).toFixed(0)}% accuracy rate</b>. The model was trained using{" "}
            <b>{model.trainCount} data</b>.
          </>
        }
      />
      <div className="flex justify-end mb-3">
        <Button
          variant="primary"
          size="default"
          className="rounded-lg px-6 py-2 text-base min-w-fit"
          onClick={() =>
            setShowGuidance((prev) => {
              const next = !prev;
              if (!next) setSelectedIdx(null);
              return next;
            })
          }
        >
          {showGuidance ? "Hide Guidance" : "Show Guidance"}
        </Button>
      </div>

      {/* Baris dua kolom: kiri chart, kanan guidance (top aligned) */}
      <div className="flex flex-row gap-6 items-start">
        {/* Kolom kiri = Chart */}
        <div className="flex-1 min-w-0">
          <div
            className="bg-white rounded-xl border border-[#D0D5DD] shadow p-6"
            style={{
              boxShadow: "0px 4px 24px 0px #00000014",
              height: chartHeight + INNER_PADDING,
            }}
          >
            <Bar key={chartKey} ref={chartRef} data={chartData} options={chartOptions} height={chartHeight + INNER_PADDING} />
            {others.length > 0 && (
              <Button variant="secondary" size="default" className="mt-10 mb-20 ml-0" onClick={() => setSeeMore((v) => !v)}>
                {seeMore ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        </div>

        {/* Kolom kanan = dua kartu, top-nya align dengan chart */}
        {showGuidance && (
          <div className="flex flex-col gap-4 w-[380px]">
            <div className="bg-white rounded-xl border border-[#D0D5DD] shadow px-6 py-4">
              <div className="font-bold text-[18px] mb-1">What is Feature Importance?</div>
              <div className="text-[#607B96] text-base">{guidanceFeatureImportance}</div>
            </div>
            <div className="bg-white rounded-xl border border-[#D0D5DD] shadow px-6 py-4 min-h-[120px]">
              <div className="font-bold text-[18px] mb-1">Feature Details</div>
              <div className="text-[#607B96] text-base">
                {selectedIdx !== null
                  ? displayed[selectedIdx].description
                  : "Click a bar to see details."}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}