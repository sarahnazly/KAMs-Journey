import React, { useState, useMemo, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartOptions,
  ChartData,
  ScriptableContext
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
  accuracy: number;
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

export default function FeatureImportanceSection({
  features,
  model,
  guidanceFeatureImportance,
  guidanceFeature,
  className = "",
}: FeatureImportanceProps) {
  const [showGuidance, setShowGuidance] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const sorted = useMemo(() => [...features].sort((a, b) => b.importance - a.importance), [features]);
  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);
  const displayed = seeMore ? sorted : top5;

  // Ref untuk update chart
  const chartRef = useRef<any>(null);

  // Force update untuk jaga-jaga (meski gradient pakai ctx dari callback)
  useEffect(() => {
    chartRef.current?.update();
  }, [displayed, showGuidance, selectedIdx]);

  // Key untuk force remount bila perlu
  const chartKey = useMemo(
    () => `${displayed.length}-${showGuidance}-${selectedIdx ?? "none"}`,
    [displayed.length, showGuidance, selectedIdx]
  );

  const chartData: ChartData<"bar"> = useMemo(() => ({
    labels: displayed.map(f => f.name),
    datasets: [
      {
        data: displayed.map(f => f.importance),
        borderWidth: 0,
        borderRadius: BAR_RADIUS,
        backgroundColor: (ctx: ScriptableContext<"bar">) => {
          const { ctx: canvasCtx } = ctx.chart;
          const idx = ctx.dataIndex;

          const makeGrad = (from: string, to: string) => {
            const grad = canvasCtx.createLinearGradient(0, 0, 0, BAR_HEIGHT);
            grad.addColorStop(0, from);
            grad.addColorStop(1, to);
            return grad;
          };

          if (showGuidance && selectedIdx !== null) {
            if (idx === selectedIdx) {
              return makeGrad("rgba(0,124,225,0.60)", "rgba(132,180,220,0.40)");
            }
            return makeGrad("#CBD5E1", "#CBD5E1");
          }
          return makeGrad("rgba(0,124,225,0.60)", "rgba(132,180,220,0.40)");
        },
        hoverBackgroundColor: (ctx: ScriptableContext<"bar">) => {
          const { ctx: canvasCtx } = ctx.chart;
          const grad = canvasCtx.createLinearGradient(0, 0, 0, BAR_HEIGHT);
          grad.addColorStop(0, "rgba(0,124,225,0.80)");
          grad.addColorStop(1, "rgba(132,180,220,0.60)");
          return grad;
        },
        barThickness: BAR_HEIGHT,
        // Gap antar bar
        categoryPercentage: 0.48,
        barPercentage: 0.9,
      }
    ]
  }), [displayed, showGuidance, selectedIdx]);

  const chartOptions: ChartOptions<"bar"> = useMemo(() => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: BAR_GAP / 2,
        bottom: BAR_GAP / 2,
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label || ""} ${ctx.parsed.x.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: Math.max(...displayed.map(f => f.importance), 0.4),
        ticks: {
          color: "#607B96",
          font: { size: 13, family: "Inter" },
          stepSize: 0.05,
          callback: (val) => (typeof val === "number" ? val.toFixed(2) : val),
        },
        grid: { color: "#E5E7EB" },
        border: { color: "#E5E7EB" },
      },
      y: {
        ticks: {
          color: "#23385B",
          font: { size: 15, family: "Inter", weight: "bold" },
        },
        grid: { color: "#E5E7EB" },
        border: { color: "#E5E7EB" },
      }
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        // Toggle bar: klik bar sama => tutup guidance dan reset warna
        if (showGuidance && selectedIdx === idx) {
          setShowGuidance(false);
          setSelectedIdx(null);
        } else {
          setShowGuidance(true);
          setSelectedIdx(idx);
        }
      }
    },
    animation: { duration: 0 } // warna langsung terlihat
  }), [displayed, showGuidance, selectedIdx]);

  useEffect(() => {
    if (!showGuidance) setSelectedIdx(null);
  }, [showGuidance]);

  useEffect(() => {
    if (selectedIdx !== null && selectedIdx >= displayed.length) {
      setSelectedIdx(null);
      setShowGuidance(false);
    }
  }, [displayed.length, selectedIdx]);

  const chartHeight = displayed.length * (BAR_HEIGHT + BAR_GAP);

  return (
    <section className={className}>
      {/* Grid 2 kolom: kiri = info + chart, kanan = guidance */}
      <div className="flex flex-row gap-6 mb-6">
        {/* Kolom kiri: InfoAlert + Button + Chart (semua lebarnya sama) */}
        <div className="flex-1 min-w-0">
          <InfoAlert
            title="Model Information"
            className="mb-4 max-w-none"  // override max-w bawaan supaya full mengikuti lebar kolom kiri
            message={
              <>
                This prediction uses <b>{model.name}</b> algorithm with <b>{(model.accuracy * 100).toFixed(0)}% accuracy rate</b>.
                The model was trained using <b>{model.trainCount} data</b>.
              </>
            }
          />
          <div className="flex justify-end mb-3">
            <Button
              variant="primary"
              size="default"
              className="rounded-lg px-6 py-2 text-base min-w-fit"
              onClick={() => setShowGuidance(prev => {
                const next = !prev;
                if (!next) setSelectedIdx(null);
                return next;
              })}
            >
              {showGuidance ? "Hide Guidance" : "Show Guidance"}
            </Button>
          </div>
          <div
            className="bg-white rounded-xl border border-[#D0D5DD] shadow p-6"
            style={{
              boxShadow: "0px 4px 24px 0px #00000014",
              height: chartHeight + 60
            }}
          >
            <Bar
              key={chartKey}
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              height={chartHeight + 60}
            />
            {others.length > 0 && (
              <Button
                variant="secondary"
                size="default"
                className="mt-10"
                onClick={() => setSeeMore(v => !v)}
              >
                {seeMore ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        </div>
        {/* Kolom kanan: Guidance/Details */}
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
                  : "Click a bar to see details."
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}