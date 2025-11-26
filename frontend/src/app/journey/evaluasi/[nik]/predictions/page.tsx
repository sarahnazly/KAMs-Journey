"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Card from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import Table, { TableColumn } from "@/components/dashboard/Table";
import { ArrowLeft } from "lucide-react";

type KPIData = {
  name: string;
  current: number;
  predicted: number;
  target: number;
  delta: number;
  deltaPercent: string;
  status: string;
  category?: string;
};

type KPICategory = {
  name: string;
  key: string;
  kpis: string[];
};

// Define KPI categories for grouping
const KPI_CATEGORIES: KPICategory[] = [
  {
    name: "Sales Performance",
    key: "sales",
    kpis: [
      "Revenue Sales Achievement",
      "Sales Achievement Datin",
      "Sales Achievement Wi-Fi",
      "Sales Achievement HSI",
      "Sales Achievement Wireline",
    ],
  },
  {
    name: "Financial Metrics",
    key: "financial",
    kpis: ["Profitability Achievement", "Collection Rate Achievement"],
  },
  {
    name: "Operational & Tools",
    key: "operational",
    kpis: ["AE Tools Achievement"],
  },
  {
    name: "People & Culture",
    key: "people",
    kpis: ["Capability Achievement", "Behaviour Achievement", "NPS"],
  },
];

// Employee database - static data
const EMPLOYEE_DATABASE = {
  "20919": {
    name: "Ratu Nadya Anjania",
    current: {
      revenueSales: 80,
      salesDatin: 80,
      salesWiFi: 80,
      salesHSI: 75,
      salesWireline: 70,
      profitability: 80,
      collectionRate: 70,
      aeTools: 75,
      capability: 55,
      behaviour: 85,
      nps: 78,
      evaluationQuadrant: 3,
    },
    growthTrend: "high",
    evaluationCategory: "Melanjutkan",
  },
  "20971": {
    name: "Sarah Nazly Nuraya",
    current: {
      revenueSales: 80,
      salesDatin: 80,
      salesWiFi: 85,
      salesHSI: 80,
      salesWireline: 75,
      profitability: 80,
      collectionRate: 75,
      aeTools: 80,
      capability: 55,
      behaviour: 90,
      nps: 82,
      evaluationQuadrant: 3,
    },
    growthTrend: "high",
    evaluationCategory: "Melanjutkan",
  },
  "20984": {
    name: "Anindya Maulida Widyatmoko",
    current: {
      revenueSales: 80,
      salesDatin: 78,
      salesWiFi: 80,
      salesHSI: 75,
      salesWireline: 72,
      profitability: 80,
      collectionRate: 80,
      aeTools: 78,
      capability: 55,
      behaviour: 75,
      nps: 70,
      evaluationQuadrant: 2,
    },
    growthTrend: "moderate",
    evaluationCategory: "Perlu Pengembangan Kompetensi",
  },
  "20992": {
    name: "John Doe",
    current: {
      revenueSales: 80,
      salesDatin: 75,
      salesWiFi: 70,
      salesHSI: 68,
      salesWireline: 65,
      profitability: 80,
      collectionRate: 65,
      aeTools: 80,
      capability: 55,
      behaviour: 60,
      nps: 55,
      evaluationQuadrant: 2,
    },
    growthTrend: "low",
    evaluationCategory: "SP 3",
  },
  "20993": {
    name: "Jane Smith",
    current: {
      revenueSales: 85,
      salesDatin: 85,
      salesWiFi: 88,
      salesHSI: 82,
      salesWireline: 80,
      profitability: 85,
      collectionRate: 80,
      aeTools: 85,
      capability: 60,
      behaviour: 88,
      nps: 85,
      evaluationQuadrant: 3,
    },
    growthTrend: "moderate",
    evaluationCategory: "SP 1",
  },
  "20994": {
    name: "Ahmad Yani",
    current: {
      revenueSales: 60,
      salesDatin: 58,
      salesWiFi: 55,
      salesHSI: 52,
      salesWireline: 50,
      profitability: 60,
      collectionRate: 50,
      aeTools: 55,
      capability: 40,
      behaviour: 45,
      nps: 40,
      evaluationQuadrant: 1,
    },
    growthTrend: "declining",
    evaluationCategory: "Diberhentikan",
  },
};

export default function PredictionsPage() {
  const router = useRouter();
  const params = useParams();
  const nik = (params?. nik as string) || "20919";
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const quadrantChartRef = useRef<HTMLCanvasElement>(null);
  const quadrantChartInstanceRef = useRef<any>(null);

  // State for active category tab
  const [activeCategory, setActiveCategory] = useState<string>("sales");

  // State for client-side generated data
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Generate predictions on client-side only (FOR PROTOTYPE PURPOSES ONLY, WILL BE FIXED)
  useEffect(() => {
    const generatePredictionsForEmployee = (nikParam: string) => {
      const employee = EMPLOYEE_DATABASE[nikParam as keyof typeof EMPLOYEE_DATABASE];
      if (!employee) {
        return {
          employeeName: "Unknown Employee",
          kpiData: [],
        };
      }

      const { current, growthTrend } = employee;

      const growthMultipliers = {
        high: { min: 1.1, max: 1.25 },
        moderate: { min: 1.05, max: 1.15 },
        low: { min: 1.0, max: 1.08 },
        declining: { min: 0.85, max: 0.98 },
      };

      const multiplier = growthMultipliers[growthTrend as keyof typeof growthMultipliers];

      const generatePrediction = (currentValue: number, variance: number = 0.1) => {
        const baseGrowth = multiplier.min + Math.random() * (multiplier.max - multiplier.min);
        const varianceAdjustment = 1 + (Math.random() - 0.5) * variance;
        return Math.round(Math.min(100, currentValue * baseGrowth * varianceAdjustment));
      };

      const predictions = {
        revenueSales: generatePrediction(current.revenueSales),
        salesDatin: generatePrediction(current.salesDatin),
        salesWiFi: generatePrediction(current.salesWiFi),
        salesHSI: generatePrediction(current. salesHSI),
        salesWireline: generatePrediction(current.salesWireline),
        profitability: generatePrediction(current.profitability),
        collectionRate: generatePrediction(current.collectionRate, 0.15),
        aeTools: generatePrediction(current. aeTools, 0.12),
        capability: generatePrediction(current.capability, 0.2),
        behaviour: generatePrediction(current.behaviour, 0.12),
        nps: generatePrediction(current.nps, 0.15),
        evaluationQuadrant: Math.round(
          Math.min(4, Math.max(1, current.evaluationQuadrant + (Math.random() > 0.5 ? 1 : 0)))
        ),
      };

      const calculateStatus = (current: number, predicted: number, target: number) => {
        if (predicted >= target + 5) return "Exceeds";
        if (predicted >= target - 2) return "On Track";
        if (predicted >= target - 10) return "Near Target";
        return "Needs Focus";
      };

      const getCategory = (kpiName: string): string => {
        for (const cat of KPI_CATEGORIES) {
          if (cat.kpis.includes(kpiName)) {
            return cat. name;
          }
        }
        return "Other";
      };

      const kpiDataUnsorted = [
        {
          name: "Revenue Sales Achievement",
          current: current.revenueSales,
          predicted: predictions.revenueSales,
          target: 90,
          delta: predictions.revenueSales - current.revenueSales,
          deltaPercent: `${predictions.revenueSales >= current.revenueSales ? "+" : ""}${(((predictions.revenueSales - current.revenueSales) / current.revenueSales) * 100).toFixed(1)}%`,
          status: calculateStatus(current.revenueSales, predictions.revenueSales, 90),
          category: getCategory("Revenue Sales Achievement"),
        },
        {
          name: "Sales Achievement Datin",
          current: current. salesDatin,
          predicted: predictions. salesDatin,
          target: 90,
          delta: predictions.salesDatin - current.salesDatin,
          deltaPercent: `${predictions.salesDatin >= current.salesDatin ? "+" : ""}${(((predictions.salesDatin - current.salesDatin) / current. salesDatin) * 100).toFixed(1)}%`,
          status: calculateStatus(current.salesDatin, predictions. salesDatin, 90),
          category: getCategory("Sales Achievement Datin"),
        },
        {
          name: "Sales Achievement Wi-Fi",
          current: current. salesWiFi,
          predicted: predictions.salesWiFi,
          target: 90,
          delta: predictions.salesWiFi - current.salesWiFi,
          deltaPercent: `${predictions.salesWiFi >= current.salesWiFi ? "+" : ""}${(((predictions.salesWiFi - current. salesWiFi) / current.salesWiFi) * 100).toFixed(1)}%`,
          status: calculateStatus(current.salesWiFi, predictions. salesWiFi, 90),
          category: getCategory("Sales Achievement Wi-Fi"),
        },
        {
          name: "Sales Achievement HSI",
          current: current.salesHSI,
          predicted: predictions.salesHSI,
          target: 85,
          delta: predictions.salesHSI - current.salesHSI,
          deltaPercent: `${predictions.salesHSI >= current.salesHSI ? "+" : ""}${(((predictions.salesHSI - current.salesHSI) / current.salesHSI) * 100). toFixed(1)}%`,
          status: calculateStatus(current.salesHSI, predictions.salesHSI, 85),
          category: getCategory("Sales Achievement HSI"),
        },
        {
          name: "Sales Achievement Wireline",
          current: current.salesWireline,
          predicted: predictions.salesWireline,
          target: 85,
          delta: predictions.salesWireline - current.salesWireline,
          deltaPercent: `${predictions.salesWireline >= current.salesWireline ? "+" : ""}${(((predictions.salesWireline - current.salesWireline) / current.salesWireline) * 100). toFixed(1)}%`,
          status: calculateStatus(current.salesWireline, predictions.salesWireline, 85),
          category: getCategory("Sales Achievement Wireline"),
        },
        {
          name: "Profitability Achievement",
          current: current.profitability,
          predicted: predictions.profitability,
          target: 85,
          delta: predictions.profitability - current.profitability,
          deltaPercent: `${predictions.profitability >= current.profitability ? "+" : ""}${(((predictions.profitability - current.profitability) / current. profitability) * 100).toFixed(1)}%`,
          status: calculateStatus(current.profitability, predictions. profitability, 85),
          category: getCategory("Profitability Achievement"),
        },
        {
          name: "Collection Rate Achievement",
          current: current.collectionRate,
          predicted: predictions.collectionRate,
          target: 85,
          delta: predictions.collectionRate - current.collectionRate,
          deltaPercent: `${predictions.collectionRate >= current.collectionRate ? "+" : ""}${(((predictions.collectionRate - current.collectionRate) / current. collectionRate) * 100).toFixed(1)}%`,
          status: calculateStatus(current.collectionRate, predictions. collectionRate, 85),
          category: getCategory("Collection Rate Achievement"),
        },
        {
          name: "AE Tools Achievement",
          current: current. aeTools,
          predicted: predictions. aeTools,
          target: 90,
          delta: predictions.aeTools - current.aeTools,
          deltaPercent: `${predictions.aeTools >= current.aeTools ? "+" : ""}${(((predictions.aeTools - current.aeTools) / current. aeTools) * 100).toFixed(1)}%`,
          status: calculateStatus(current. aeTools, predictions. aeTools, 90),
          category: getCategory("AE Tools Achievement"),
        },
        {
          name: "Capability Achievement",
          current: current. capability,
          predicted: predictions.capability,
          target: 85,
          delta: predictions.capability - current.capability,
          deltaPercent: `${predictions.capability >= current.capability ? "+" : ""}${(((predictions.capability - current.capability) / current.capability) * 100).toFixed(1)}%`,
          status: calculateStatus(current. capability, predictions.capability, 85),
          category: getCategory("Capability Achievement"),
        },
        {
          name: "Behaviour Achievement",
          current: current.behaviour,
          predicted: predictions.behaviour,
          target: 85,
          delta: predictions.behaviour - current.behaviour,
          deltaPercent: `${predictions. behaviour >= current.behaviour ? "+" : ""}${(((predictions.behaviour - current. behaviour) / current. behaviour) * 100).toFixed(1)}%`,
          status: calculateStatus(current.behaviour, predictions.behaviour, 85),
          category: getCategory("Behaviour Achievement"),
        },
        {
          name: "NPS",
          current: current.nps,
          predicted: predictions. nps,
          target: 80,
          delta: predictions.nps - current.nps,
          deltaPercent: `${predictions. nps >= current. nps ? "+" : ""}${(((predictions.nps - current.nps) / current.nps) * 100).toFixed(1)}%`,
          status: calculateStatus(current.nps, predictions.nps, 80),
          category: getCategory("NPS"),
        },
        {
          name: "Evaluation Quadrant",
          current: current.evaluationQuadrant,
          predicted: predictions.evaluationQuadrant,
          target: 1,
          delta: predictions.evaluationQuadrant - current. evaluationQuadrant,
          deltaPercent: "", // Kosongkan untuk quadrant
          status: 
            predictions.evaluationQuadrant < current.evaluationQuadrant 
              ? "Improving" 
              : predictions.evaluationQuadrant > current.evaluationQuadrant 
                ? "Declining" 
                : "Stable",
          category: "Evaluation",
          }
      ];

      return {
        employeeName: employee.name,
        kpiData: kpiDataUnsorted,
      };
    };

    const result = generatePredictionsForEmployee(nik);
    setEmployeeName(result. employeeName);
    setKpiData(result.kpiData);
    setIsLoading(false);
  }, [nik]);

  const employeeData = useMemo(
    () => ({
      nik: nik,
      name: employeeName,
    }),
    [nik, employeeName]
  );

  // Filter KPIs based on active category for the chart
  const filteredKpiData = useMemo(() => {
    const category = KPI_CATEGORIES. find((c) => c.key === activeCategory);
    if (!category) return [];
    return kpiData.filter(
      (d) => category.kpis. includes(d.name) && d.name !== "Evaluation Quadrant"
    );
  }, [kpiData, activeCategory]);

  // Initialize Chart.js for KPI bars
  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef. current || filteredKpiData. length === 0) return;

      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: filteredKpiData.map((d) => d. name),
          datasets: [
            {
              label: "Q1 2025 (Actual)",
              data: filteredKpiData.map((d) => d.current),
              backgroundColor: "#64748b",
              borderRadius: 4,
              maxBarThickness: 40,
            },
            {
              label: "Q2 2025 (Predicted)",
              data: filteredKpiData.map((d) => d. predicted),
              backgroundColor: "#1e3a8a",
              borderRadius: 4,
              maxBarThickness: 40,
            },
            {
              label: "Target",
              data: filteredKpiData.map((d) => d.target),
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
              top: activeCategory === "all" ? 30 : 0,
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
                  const label = context.dataset.label || "";
                  const value = context.parsed.x;
                  return label + ": " + value + "%";
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
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
              grid: {
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
  }, [filteredKpiData, activeCategory]);

  // Initialize Quadrant Chart
  useEffect(() => {
    const loadQuadrantChart = async () => {
      if (!quadrantChartRef.current || kpiData.length === 0) return;

      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (quadrantChartInstanceRef.current) {
        quadrantChartInstanceRef.current.destroy();
      }

      const quadrantData = kpiData.find((d) => d.name === "Evaluation Quadrant");
      if (!quadrantData) return;

      const ctx = quadrantChartRef.current.getContext("2d");
      if (!ctx) return;

      const quadrantToCoords = (quadrant: number): { x: number; y: number } => {
        switch (quadrant) {
          case 1: return { x: 75, y: 75 };
          case 2: return { x: 25, y: 75 };
          case 3: return { x: 75, y: 25 };
          case 4: return { x: 25, y: 25 };
          default: return { x: 50, y: 50 };
        }
      };

      const currentCoords = quadrantToCoords(quadrantData.current);
      const predictedCoords = quadrantToCoords(quadrantData.predicted);
      const targetCoords = quadrantToCoords(quadrantData.target);

      const addOffset = (
        coords: { x: number; y: number },
        offsetX: number,
        offsetY: number
      ) => ({
        x: coords.x + offsetX,
        y: coords.y + offsetY,
      });

      const currentWithOffset = addOffset(currentCoords, -10, -5);
      const predictedWithOffset = addOffset(predictedCoords, 0, 5);
      const targetWithOffset = addOffset(targetCoords, 10, -5);

      const quadrantBackgroundPlugin = {
        id: "quadrantBackground",
        beforeDatasetsDraw: (chart: any) => {
          const {
            ctx,
            chartArea: { left, top, right, bottom },
            scales: { x, y },
          } = chart;

          const centerX = x.getPixelForValue(50);
          const centerY = y.getPixelForValue(50);

          ctx.save();

          ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
          ctx.fillRect(centerX, top, right - centerX, centerY - top);

          ctx.fillStyle = "rgba(59, 130, 246, 0. 15)";
          ctx.fillRect(left, top, centerX - left, centerY - top);

          ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
          ctx.fillRect(centerX, centerY, right - centerX, bottom - centerY);

          ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
          ctx.fillRect(left, centerY, centerX - left, bottom - centerY);

          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx. moveTo(centerX, top);
          ctx.lineTo(centerX, bottom);
          ctx.stroke();

          ctx. beginPath();
          ctx.moveTo(left, centerY);
          ctx.lineTo(right, centerY);
          ctx.stroke();

          ctx.setLineDash([]);

          ctx.font = "bold 11px Inter, sans-serif";
          ctx.textAlign = "center";

          ctx.fillStyle = "#059669";
          ctx.fillText("Q1 - Star Performer", (centerX + right) / 2, top + 20);

          ctx.fillStyle = "#2563eb";
          ctx. fillText("Q2 - High Potential", (left + centerX) / 2, top + 20);

          ctx.fillStyle = "#d97706";
          ctx.fillText("Q3 - Solid Performer", (centerX + right) / 2, bottom - 10);

          ctx. fillStyle = "#dc2626";
          ctx.fillText("Q4 - Needs Development", (left + centerX) / 2, bottom - 10);

          ctx. restore();
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
              pointHoverRadius: 18,
              pointStyle: "circle",
            },
            {
              label: "Predicted Position",
              data: [predictedWithOffset],
              backgroundColor: "#1e3a8a",
              borderColor: "#ffffff",
              borderWidth: 2,
              pointRadius: 14,
              pointHoverRadius: 18,
              pointStyle: "circle",
            },
            {
              label: "Target",
              data: [targetWithOffset],
              backgroundColor: "#10B981",
              borderColor: "#ffffff",
              borderWidth: 2,
              pointRadius: 14,
              pointHoverRadius: 18,
              pointStyle: "triangle",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || "";
                  const x = context.parsed. x;
                  const y = context. parsed.y;

                  let quadrant = 4;
                  if (x > 50 && y > 50) quadrant = 1;
                  else if (x <= 50 && y > 50) quadrant = 2;
                  else if (x > 50 && y <= 50) quadrant = 3;
                  else quadrant = 4;

                  const quadrantNames: { [key: number]: string } = {
                    1: "Star Performer",
                    2: "High Potential",
                    3: "Solid Performer",
                    4: "Needs Development",
                  };
                  return `${label}: Q${quadrant} (${quadrantNames[quadrant]})`;
                },
              },
            },
          },
          scales: {
            x: {
              min: 0,
              max: 100,
              title: {
                display: true,
                text: "Performance →",
                font: {
                  size: 13,
                  family: "Inter, sans-serif",
                  weight: "bold",
                },
                color: "#0F172A",
              },
              ticks: { display: false },
              grid: { display: false },
              border: { display: true, color: "#e2e8f0" },
            },
            y: {
              min: 0,
              max: 100,
              title: {
                display: true,
                text: "↑ Potential",
                font: {
                  size: 13,
                  family: "Inter, sans-serif",
                  weight: "bold",
                },
                color: "#0F172A",
              },
              ticks: { display: false },
              grid: { display: false },
              border: { display: true, color: "#e2e8f0" },
            },
          },
        },
        plugins: [quadrantBackgroundPlugin],
      });
    };

    loadQuadrantChart();

    return () => {
      if (quadrantChartInstanceRef.current) {
        quadrantChartInstanceRef.current.destroy();
      }
    };
  }, [kpiData]);

  // Table columns
  const columns: TableColumn[] = useMemo(
    () => [
      { label: "KPI", key: "name", sortable: true },
      {
        label: "Current",
        key: "current",
        sortable: true,
        render: (value, row) =>
          row.name === "Evaluation Quadrant" ? `Q${value}` : `${value}%`,
      },
      {
        label: "Predicted",
        key: "predicted",
        sortable: true,
        render: (value, row) =>
          row.name === "Evaluation Quadrant" ? `Q${value}` : `${value}%`,
      },
      {
        label: "Target",
        key: "target",
        sortable: true,
        render: (value, row) =>
          row.name === "Evaluation Quadrant" ? `Q${value}` : `${value}%`,
      },
      {
        label: "Δ (pts)",
        key: "delta",
        sortable: true,
        render: (value, row) => {
          if (row.name === "Evaluation Quadrant") {
            return <span className="text-gray-400">-</span>;
          }

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
              {numValue}
            </span>
          );
        },
      },
      {
        label: "Status",
        key: "status",
        sortable: true,
        render: (value, row) => {
          // Special status for Evaluation Quadrant based on delta
          if (row.name === "Evaluation Quadrant") {
            const delta = row.predicted - row.current;
            if (delta < 0) {
              return (
                <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-[#D1FAE5] text-[#065F46]">
                  ↑ Improving
                </span>
              );
            } else if (delta > 0) {
              return (
                <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">
                  ↓ Declining
                </span>
              );
            }
            return (
              <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-[#E2E8F0] text-[#475569]">
                → Stable
              </span>
            );
          }

          const statusStyles: Record<string, string> = {
            Exceeds: "bg-[#E2E8F0] text-[#475569]",
            "On Track": "bg-[#E2E8F0] text-[#475569]",
            "Near Target": "bg-[#E2E8F0] text-[#475569]",
            "Needs Focus": "bg-[#FEE2E2] text-[#DC2626]",
          };
          return (
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-semibold ${statusStyles[value] || ""}`}
            >
              {value}
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
    const heightPerKpi = 50;
    return Math.max(200, baseHeight + filteredKpiData. length * heightPerKpi);
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
              {employeeData. nik} - {employeeData.name}
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
              <p className="text-[14px] text-[#637381] leading-relaxed">
                This prediction uses{" "}
                <span className="font-semibold">XGBoost</span> algorithm with{" "}
                <span className="font-semibold">85% accuracy rate</span>.  The
                model was trained using{" "}
                <span className="font-semibold">500 data</span>. 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card with Category Tabs */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 pb-6">
          <Card
            heading="KPI Performance Overview"
            description="Current vs Predicted performance metrics by category"
            className="shadow-sm"
          >
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6 border-b border-gray-200 pb-4">
              {KPI_CATEGORIES.map((category) => (
                <button
                  key={category. key}
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
            <div className="flex flex-wrap justify-center gap-6 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#64748b] border-2 border-white shadow"></div>
                <div>
                  <span className="text-sm text-gray-500">Current:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    Q{kpiData.find((d) => d. name === "Evaluation Quadrant")?. current || "-"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#1e3a8a] border-2 border-white shadow"></div>
                <div>
                  <span className="text-sm text-gray-500">Predicted:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    Q{kpiData.find((d) => d.name === "Evaluation Quadrant")?.predicted || "-"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#10B981]"></div>
                <div>
                  <span className="text-sm text-gray-500">Target:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    Q{kpiData.find((d) => d.name === "Evaluation Quadrant")?.target || "-"}
                  </span>
                </div>
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
                  data={kpiData}
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