"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import Table, { TableColumn } from "@/components/dashboard/Table";
import { ArrowLeft } from "lucide-react";
import { KPIData } from "@/interfaces/evaluasi/types";
import { fetchEvaluasiByNik } from "@/services/evaluasiService";
import { fetchPredictionForNik } from "@/services/evaluationPredictionService";
import {
  mapToAEDetail,
} from "@/utils/mappers/evaluasi/mapApiToUi";
import { KPI_CATEGORIES } from "@/utils/mappers/evaluasi/kpiCategories";

// Helper function to check if category has subcategories
const hasSubcategories = (categoryKey: string): boolean => {
  const category = KPI_CATEGORIES.find((c) => c.key === categoryKey);
  return !!(category?.subcategories && category.subcategories.length > 0);
};

function getNextQuarter(q: string) {
  switch (q) {
    case "Q1": return { quarter: "Q2", yearDelta: 0 };
    case "Q2": return { quarter: "Q3", yearDelta: 0 };
    case "Q3": return { quarter: "Q4", yearDelta: 0 };
    case "Q4": return { quarter: "Q1", yearDelta: 1 };
    default:   return { quarter: "Q4", yearDelta: 0 }; 
  }
}

export default function PredictionsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const actualQuarterSelected = searchParams.get("quarter") || "Q3";
  const actualYearSelected = Number(searchParams.get("year") || 2025);

  const nik = params?.nik as string;
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const quadrantChartRef = useRef<HTMLCanvasElement>(null);
  const quadrantChartInstanceRef = useRef<any>(null);

  // State for active category tab (main tab)
  const [activeCategory, setActiveCategory] = useState<string>("result");

  // State for active subcategory tab (subtab) - only used for Result
  const [activeSubcategory, setActiveSubcategory] = useState<string>("financial");

  // State for client-side generated data
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [predictedMeta, setPredictedMeta] = useState<{ quarter: string; year: number } | null>(null);
  const [currentQuadrant, setCurrentQuadrant] = useState<number>(0);
  const [predictedQuadrant, setPredictedQuadrant] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [modelInfo, setModelInfo] = useState<{
    regressor: string;
    classifier: string;
    mean_r2: number;
    f1_macro:  number;
    dataCount: number;
  } | null>(null);

  // Check if current category has subcategories
  const currentHasSubcategories = useMemo(
    () => hasSubcategories(activeCategory),
    [activeCategory]
  );

  // Get subcategories for the active category (only for Result)
  const activeSubcategories = useMemo(() => {
    const category = KPI_CATEGORIES.find((c) => c.key === activeCategory);
    return category?.subcategories || [];
  }, [activeCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    const category = KPI_CATEGORIES.find((c) => c.key === activeCategory);
    if (category?.subcategories && category.subcategories.length > 0) {
      setActiveSubcategory(category.subcategories[0].key);
    }
  }, [activeCategory]);

  useEffect(() => {
    async function loadData() {
      if (!nik) return;

      try {
        setIsLoading(true);
        setError("");

        const next = getNextQuarter(actualQuarterSelected);

        const actualQuarter = `${actualQuarterSelected} ${actualYearSelected}`;
        const predictedQuarter = next.quarter;
        const predictedYear = actualYearSelected + next.yearDelta;

        // Fetch both in parallel
        const [actualData, predictionResponse] = await Promise.all([
          fetchEvaluasiByNik(parseInt(nik), actualQuarter),
          fetchPredictionForNik(parseInt(nik), predictedQuarter, predictedYear),
        ]);

        // Use mapper to transform data
        const aeDetail = mapToAEDetail(
          actualData,
          predictionResponse
        );

        setEmployeeName(aeDetail.name);
        setKpiData(aeDetail.kpis);
        setCurrentQuadrant(aeDetail.quadrant.current);
        setPredictedQuadrant(aeDetail.quadrant.predicted || 0);

        // Extract model metadata
        setModelInfo({
          regressor: predictionResponse.meta.best_regressor,
          classifier: predictionResponse.meta.best_classifier,
          mean_r2: predictionResponse.meta.metrics.regression.mean_r2,
          f1_macro: 
            predictionResponse.meta.metrics.classification.f1_macro,
          dataCount: 700,
        });

        const predictedQuarterFromMeta = predictionResponse.meta.quarter;
        const predictedYearFromMeta = predictionResponse.meta.year;

        setPredictedMeta({
          quarter: predictedQuarterFromMeta,
          year: predictedYearFromMeta
        });
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [nik, actualQuarterSelected, actualYearSelected]);

  const employeeData = useMemo(
    () => ({
      nik:  nik,
      name: employeeName,
    }),
    [nik, employeeName]
  );

  // Filter KPIs based on active category/subcategory
  const filteredKpiData = useMemo(() => {
    if (currentHasSubcategories) {
      // Result tab has subcategories
      const activeSubcategoryObj = activeSubcategories.find(
        (s) => s.key === activeSubcategory
      );

      if (!activeSubcategoryObj) return [];

      // Get KPI keys from the subcategory definition
      const subcategoryKpiKeys = activeSubcategoryObj.kpis.map((k:  any) => k.key);

      // Filter by matching KPI keys
      return kpiData.filter((d) => subcategoryKpiKeys.includes(d.key));
    } else {
      // Overview or Process tabs (no subcategories)
      const category = KPI_CATEGORIES.find((c) => c.key === activeCategory);
      
      if (!category || !category.subcategories[0]) return [];

      // Get KPI keys from the category definition
      const categoryKpiKeys = category.subcategories[0].kpis.map((k: any) => k.key);

      // Filter by matching KPI keys
      return kpiData.filter((d) => categoryKpiKeys.includes(d.key));
    }
  }, [
    kpiData,
    activeCategory,
    activeSubcategory,
    currentHasSubcategories,
    activeSubcategories,
  ]);

  const tableKpiData = useMemo(() => {
    // Get all KPI keys inside Result category
    const resultKeys = KPI_CATEGORIES
      .find((c) => c.key === "result")
      ?.subcategories.flatMap((sub) => sub.kpis.map((k) => k.key)) || [];

    // Get all KPI keys inside Process category
    const processKeys = KPI_CATEGORIES
      .find((c) => c.key === "process")
      ?.subcategories.flatMap((sub) => sub.kpis.map((k) => k.key)) || [];

    const allowedKeys = [...resultKeys, ...processKeys];

    // Filter KPI data based on the allowed list
    return kpiData.filter((kpi) => allowedKeys.includes(kpi.key));
  }, [kpiData]);

  // Initialize Bar Chart
  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current || filteredKpiData.length === 0) return;

      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      // Calculate min/max to handle negative values
      const allValues = filteredKpiData.flatMap((d) => [
        d.current,
        d.predicted || 0,
      ]);
      const minValue = Math.min(0, ...allValues); // Allow negative
      const maxValue = Math.max(100, ...allValues); // Allow >100%

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: filteredKpiData.map((d) => d.name),
          datasets: [
            {
              label: `${actualQuarterSelected} ${actualYearSelected} (Actual)`,
              data: filteredKpiData.map((d) => d.current),
              backgroundColor: "#1e3a8a",
              borderRadius: 4,
              maxBarThickness: 40,
            },
            {
              label: predictedMeta 
                ? `${predictedMeta.quarter} ${predictedMeta.year} (Predicted)` 
                : "Predicted",
              data: filteredKpiData.map((d) => d.predicted),
              backgroundColor: "#94a3b8",
              borderRadius: 4,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 0,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              align: "end",
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 15,
                font: {
                  size: 12,
                  family: "Inter, sans-serif",
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": " +
                    context.parsed.x.toFixed(1) +
                    "%"
                  );
                },
              },
            },
          },
          scales: {
            x: {
              // Dynamic min/max to handle negative and >100% values
              min: minValue,
              max:  maxValue,
              ticks: {
                callback: function (value) {
                  return value + "%";
                },
                font: {
                  size: 11,
                  family: "Inter, sans-serif",
                },
                color: "#6B7280",
              },
              grid: {
                color: "#E5E7EB",
                lineWidth: 1,
              },
            },
            y: {
              ticks: {
                autoSkip: false,
                font: {
                  size: 11,
                  family: "Inter, sans-serif",
                },
                color: "#6B7280",
                padding: 8,
              },
              grid:  {
                display: false,
              },
            },
          },
        },
        plugins: [],
      });
    };

    loadChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [filteredKpiData, activeSubcategory, activeCategory]);

  // Initialize Quadrant Chart
  useEffect(() => {
    const loadQuadrantChart = async () => {
      if (!quadrantChartRef.current || ! currentQuadrant) return;

      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (quadrantChartInstanceRef.current) {
        quadrantChartInstanceRef.current.destroy();
      }

      const ctx = quadrantChartRef.current.getContext("2d");
      if (!ctx) return;

      const quadrantToCoords = (quadrant: number): { x: number; y: number } => {
        switch (quadrant) {
          case 1:
            return { x: 75, y: 75 };
          case 2:
            return { x: 25, y: 75 };
          case 3:
            return { x: 75, y:  25 };
          case 4:
            return { x:  25, y: 25 };
          default:
            return { x: 50, y: 50 };
        }
      };

      const currentCoords = quadrantToCoords(currentQuadrant);
      const predictedCoords = quadrantToCoords(predictedQuadrant);

      const addOffset = (
        coords: { x: number; y:  number },
        offsetX: number,
        offsetY: number
      ) => ({
        x: coords.x + offsetX,
        y: coords.y + offsetY,
      });

      const currentWithOffset = addOffset(currentCoords, -10, -5);
      const predictedWithOffset = addOffset(predictedCoords, 0, 5);

      const quadrantBackgroundPlugin = {
        id: "quadrantBackground",
        beforeDatasetsDraw:  (chart:  any) => {
          const {
            ctx,
            chartArea: { left, top, right, bottom },
            scales:  { x, y },
          } = chart;

          const centerX = x.getPixelForValue(50);
          const centerY = y.getPixelForValue(50);

          ctx.save();

          ctx.fillStyle = "rgba(30, 58, 138, 0.25)";
          ctx.fillRect(centerX, top, right - centerX, centerY - top);

          ctx.fillStyle = "rgba(37, 99, 180, 0.18)";
          ctx.fillRect(left, top, centerX - left, centerY - top);

          ctx.fillStyle = "rgba(59, 130, 200, 0.14)";
          ctx.fillRect(centerX, centerY, right - centerX, bottom - centerY);

          ctx.fillStyle = "rgba(148, 163, 184, 0.20)";
          ctx.fillRect(left, centerY, centerX - left, bottom - centerY);

          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(centerX, top);
          ctx.lineTo(centerX, bottom);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(left, centerY);
          ctx.lineTo(right, centerY);
          ctx.stroke();

          ctx.setLineDash([]);

          ctx.font = "600 11px Inter, sans-serif";
          ctx.textAlign = "center";

          ctx.fillStyle = "#02214C";
          ctx.fillText(
            "1st Quadrant - Ach. Scaling & Sustain",
            (centerX + right) / 2,
            top + 20
          );

          ctx.fillStyle = "#1e3a8a";
          ctx.fillText(
            "2nd Quadrant - Ach. Scaling Only",
            (left + centerX) / 2,
            top + 20
          );

          ctx.fillStyle = "#2d4a7c";
          ctx.fillText(
            "3rd Quadrant - Ach. Sustain Only",
            (centerX + right) / 2,
            bottom - 10
          );

          ctx.fillStyle = "#475569";
          ctx.fillText(
            "4th Quadrant - Not ach. both",
            (left + centerX) / 2,
            bottom - 10
          );

          ctx.restore();
        },
      };

      const axisLabelsPlugin = {
        id: "axisLabels",
        afterDraw: (chart: any) => {
          const {
            ctx,
            chartArea: { left, top, right, bottom },
          } = chart;

          ctx.save();

          ctx.font = "bold 13px Inter, sans-serif";
          ctx.fillStyle = "#0F172A";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText("↑ Ach. Scaling", (left + right) / 2, top - 15);

          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText("Ach. Sustain →", right + 15, (top + bottom) / 2);

          ctx.restore();
        },
      };

      quadrantChartInstanceRef.current = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Current Position",
              data: [currentWithOffset],
              backgroundColor: "#64748b",
              borderColor: "#ffffff",
              borderWidth: 2,
              pointRadius: 14,
              pointHoverRadius:  18,
              pointStyle: "circle",
            },
            {
              label:  "Predicted Position",
              data: [predictedWithOffset],
              backgroundColor: "#1e3a8a",
              borderColor:  "#ffffff",
              borderWidth:  2,
              pointRadius:  14,
              pointHoverRadius: 18,
              pointStyle: "circle",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 40,
              right: 120,
              left: 120,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || "";
                  const x = context.parsed.x;
                  const y = context.parsed.y;

                  let quadrant = 4;
                  if (x > 50 && y > 50) quadrant = 1;
                  else if (x <= 50 && y > 50) quadrant = 2;
                  else if (x > 50 && y <= 50) quadrant = 3;
                  else quadrant = 4;

                  const quadrantNames:  { [key: number]: string } = {
                    1: "Ach. Scaling & Sustain",
                    2: "Ach. Scaling Only",
                    3: "Ach. Sustain Only",
                    4: "Not ach. both",
                  };
                  return `${label}:  Quadrant ${quadrant} (${quadrantNames[quadrant]})`;
                },
              },
            },
          },
          scales: {
            x: {
              min: 0,
              max: 100,
              title: { display: false },
              ticks: { display: false },
              grid: { display: false },
              border: { display: true, color: "#e2e8f0" },
            },
            y: {
              min: 0,
              max: 100,
              title:  { display: false },
              ticks: { display: false },
              grid: { display: false },
              border: { display: true, color: "#e2e8f0" },
            },
          },
        },
        plugins: [quadrantBackgroundPlugin, axisLabelsPlugin],
      });
    };

    loadQuadrantChart();

    return () => {
      if (quadrantChartInstanceRef.current) {
        quadrantChartInstanceRef.current.destroy();
      }
    };
  }, [currentQuadrant, predictedQuadrant]);

  // Table columns
  const columns:  TableColumn[] = useMemo(
    () => [
      { label: "KPI", key: "name", sortable: true },
      {
        label: "Category",
        key: "category",
        sortable: true,
        render: (value) => (
          <span className="text-xs text-gray-500">{value}</span>
        ),
      },
      {
        label: "Current",
        key: "current",
        sortable: true,
        render: (value) => `${value.toFixed(1)}%`,
      },
      {
        label:  "Predicted",
        key:  "predicted",
        sortable:  true,
        render: (value) => (value != null ? `${value.toFixed(1)}%` : "N/A"),
      },
      {
        label: "Δ (pts)",
        key: "delta",
        sortable: true,
        render: (value) => {
          if (value == null) return <span className="text-gray-400">-</span>;

          const numValue = Number(value);
          let colorClass = "text-[#64748B]";

          if (numValue > 0) {
            colorClass = "text-[#10B981]";
          } else if (numValue < 0) {
            colorClass = "text-[#EF4444]";
          }

          return (
            <span className={`font-semibold ${colorClass}`}>
              {numValue > 0 ? "+" : ""}
              {numValue.toFixed(1)}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleBack = () => {
    router.push("/journey/evaluasi");
  };

  // Calculate dynamic chart height based on number of KPIs
  const chartHeight = useMemo(() => {
    const baseHeight = 100;
    const heightPerKpi = 60;
    return Math.max(180, baseHeight + filteredKpiData.length * heightPerKpi);
  }, [filteredKpiData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading predictions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 mb-2">
            We encountered an error while processing your request. 
          </p>
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-6 font-mono break-words">
            {error}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center">
            <Button variant="primary" onClick={handleBack}>
              Back to Overview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA]">
      {/* Header Section */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="primary"
            size="default"
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="space-y-2">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] leading-tight">
              {employeeData.nik} - {employeeData.name}
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#64748B]">
              Performance Growth Prediction
            </p>
          </div>
        </div>
      </div>

      {/* ML Model Info */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex items-start gap-4 p-5 bg-[#EFF6FF] border-l-4 border-[#16396E] rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 bg-[#16396E] rounded-lg flex-shrink-0">
              <span className="text-white text-xl font-bold">i</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[16px] font-semibold text-[#16396E] mb-1">
                Model Information
              </h2>
              {modelInfo ?  (
                <p className="text-[14px] text-[#637381] leading-relaxed">
                  This prediction uses{" "}
                  <span className="font-semibold">{modelInfo.regressor}</span>{" "}
                  algorithm for regression with{" "}
                  <span className="font-semibold">
                    {modelInfo.mean_r2.toFixed(4)} mean R² score
                  </span>
                  <span> and </span>
                  <span className="font-semibold">{modelInfo.classifier}</span>{" "}
                  algorithm for quadrant classification with{" "}
                  <span className="font-semibold">
                    {modelInfo.f1_macro.toFixed(4)} macro F1 score
                  </span>
                  . The model was trained using{" "}
                  <span className="font-semibold">
                    {modelInfo.dataCount} employee data
                  </span>
                  .
                </p>
              ) : (
                <p className="text-[14px] text-[#637381] leading-relaxed">
                  Loading model information...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card with Category Tabs and Subtabs */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 pb-6">
          <Card
            heading="KPI Performance Overview"
            description="Current vs Predicted performance metrics by category"
            className="shadow-sm"
          >
            {/* Main Category Tabs */}
            <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-gray-200">
              {KPI_CATEGORIES.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.key
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Subcategory Tabs */}
            {activeCategory === "result" && (
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {activeSubcategories.map((sub) => (
                  <button
                    key={sub.key}
                    onClick={() => setActiveSubcategory(sub.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      activeSubcategory === sub.key
                        ? "bg-[#1e3a8a]/10 text-[#1e3a8a] border-[#1e3a8a]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Spacer for Process tab */}
            {! currentHasSubcategories && <div className="mt-6" />}

            {/* Chart */}
            <div className="w-full" style={{ height: `${chartHeight}px` }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </Card>
        </div>
      </div>

      {/* Quadrant Chart Card */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 pb-6">
          <Card
            heading="Evaluation Quadrant Matrix"
            description="Performance vs Potential quadrant positioning"
            className="shadow-sm"
          >
            {/* Current Status Display */}
            <div className="flex justify-center gap-6 mb-4 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#64748b] border-2 border-white shadow"></div>
                <div>
                  <span className="text-sm text-gray-500">Current: </span>
                  <span className="ml-2 font-semibold text-gray-700">
                    Quadrant {currentQuadrant || "-"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#1e3a8a] border-2 border-white shadow"></div>
                <div>
                  <span className="text-sm text-gray-500">Predicted:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    Quadrant {predictedQuadrant || "-"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#10B981]"></div>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full h-[350px]">
              <canvas ref={quadrantChartRef}></canvas>
            </div>
          </Card>
        </div>
      </div>

      {/* KPI Table */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 pb-10">
          <Card
            heading="Detailed KPI Breakdown"
            description="Comprehensive performance metrics comparison"
            className="shadow-sm"
          >
            <div className="-mx-6 mt-4">
              <div className="px-6">
                <Table
                    columns={columns}
                    data={tableKpiData}
                    loading={false}
                    error=""
                    pageSize={12}
                    showAction={false}
                  />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}