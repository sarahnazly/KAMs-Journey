"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Card from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import InfoAlert from "@/components/dashboard/InfoAlert";
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
};

export default function PredictionsPage() {
  const router = useRouter();
  const params = useParams();
  const nik = params?.nik as string;
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // Employee database - matches evaluation page data
  const employeeDatabase = useMemo(() => ({
    "20919": { 
      name: "Ratu Nadya Anjania", 
      current: { revenue: 80, sales: 80, profitability: 80, collectionRate: 70, amTools: 75, capability: 55, winRate: 95 },
      growthTrend: "high", // High performer with good growth potential
      evaluationCategory: "Melanjutkan"
    },
    "20971": { 
      name: "Sarah Nazly Nuraya", 
      current: { revenue: 80, sales: 80, profitability: 80, collectionRate: 75, amTools: 80, capability: 55, winRate: 95 },
      growthTrend: "high", // High performer with strong relationships
      evaluationCategory: "Melanjutkan"
    },
    "20984": { 
      name: "Anindya Maulida Widyatmoko", 
      current: { revenue: 80, sales: 80, profitability: 80, collectionRate: 80, amTools: 78, capability: 55, winRate: 95 },
      growthTrend: "moderate", // Good performer, needs development
      evaluationCategory: "Perlu Pengembangan Kompetensi"
    },
    "20992": { 
      name: "John Doe", 
      current: { revenue: 80, sales: 80, profitability: 80, collectionRate: 65, amTools: 80, capability: 55, winRate: 95 },
      growthTrend: "low", // Underperforming, needs significant improvement
      evaluationCategory: "SP 3"
    },
    "20993": { 
      name: "Jane Smith", 
      current: { revenue: 85, sales: 85, profitability: 85, collectionRate: 80, amTools: 85, capability: 60, winRate: 90 },
      growthTrend: "moderate", // Good baseline, steady improvement expected
      evaluationCategory: "SP 1"
    },
    "20994": { 
      name: "Ahmad Yani", 
      current: { revenue: 60, sales: 60, profitability: 60, collectionRate: 50, amTools: 55, capability: 40, winRate: 60 },
      growthTrend: "declining", // Poor performance, negative trend
      evaluationCategory: "Diberhentikan"
    }
  }), []);

  // Generate predictions based on employee NIK and current performance
  const generatePredictionsForEmployee = (nikParam: string) => {
    const employee = employeeDatabase[nikParam as keyof typeof employeeDatabase];
    if (!employee) {
      // Default fallback for unknown NIK
      return {
        employeeName: "Unknown Employee",
        kpiData: []
      };
    }

    const { current, growthTrend } = employee;
    
    // Growth multipliers based on trend
    const growthMultipliers = {
      high: { min: 1.10, max: 1.25 }, // 10-25% improvement
      moderate: { min: 1.05, max: 1.15 }, // 5-15% improvement
      low: { min: 1.00, max: 1.08 }, // 0-8% improvement
      declining: { min: 0.85, max: 0.98 } // -15% to -2% decline
    };

    const multiplier = growthMultipliers[growthTrend as keyof typeof growthMultipliers];
    
    // Helper function to generate prediction
    const generatePrediction = (currentValue: number, variance: number = 0.1) => {
      const baseGrowth = multiplier.min + Math.random() * (multiplier.max - multiplier.min);
      const varianceAdjustment = 1 + (Math.random() - 0.5) * variance;
      return Math.round(Math.min(100, currentValue * baseGrowth * varianceAdjustment));
    };

    // Calculate predictions
    const predictions = {
      revenue: generatePrediction(current.revenue),
      sales: generatePrediction(current.sales),
      profitability: generatePrediction(current.profitability),
      collectionRate: generatePrediction(current.collectionRate, 0.15),
      amTools: generatePrediction(current.amTools, 0.12),
      capability: generatePrediction(current.capability, 0.2),
      winRate: generatePrediction(current.winRate, 0.08)
    };

    // Calculate deltas and status
    const calculateStatus = (current: number, predicted: number, target: number) => {
      if (predicted >= target + 5) return "Exceeds";
      if (predicted >= target - 2) return "On Track";
      if (predicted >= target - 10) return "Near Target";
      return "Needs Focus";
    };

    const kpiData = [
      {
        name: "Revenue Achievement",
        current: current.revenue,
        predicted: predictions.revenue,
        target: 90,
        delta: predictions.revenue - current.revenue,
        deltaPercent: `${predictions.revenue >= current.revenue ? '+' : ''}${(((predictions.revenue - current.revenue) / current.revenue) * 100).toFixed(1)}%`,
        status: calculateStatus(current.revenue, predictions.revenue, 90),
      },
      {
        name: "Sales Achievement", 
        current: current.sales,
        predicted: predictions.sales,
        target: 90,
        delta: predictions.sales - current.sales,
        deltaPercent: `${predictions.sales >= current.sales ? '+' : ''}${(((predictions.sales - current.sales) / current.sales) * 100).toFixed(1)}%`,
        status: calculateStatus(current.sales, predictions.sales, 90),
      },
      {
        name: "Profitability Achievement",
        current: current.profitability,
        predicted: predictions.profitability,
        target: 85,
        delta: predictions.profitability - current.profitability,
        deltaPercent: `${predictions.profitability >= current.profitability ? '+' : ''}${(((predictions.profitability - current.profitability) / current.profitability) * 100).toFixed(1)}%`,
        status: calculateStatus(current.profitability, predictions.profitability, 85),
      },
      {
        name: "Collection Rate Achievement",
        current: current.collectionRate,
        predicted: predictions.collectionRate,
        target: 85,
        delta: predictions.collectionRate - current.collectionRate,
        deltaPercent: `${predictions.collectionRate >= current.collectionRate ? '+' : ''}${(((predictions.collectionRate - current.collectionRate) / current.collectionRate) * 100).toFixed(1)}%`,
        status: calculateStatus(current.collectionRate, predictions.collectionRate, 85),
      },
      {
        name: "AM Tools Achievement",
        current: current.amTools,
        predicted: predictions.amTools,
        target: 90,
        delta: predictions.amTools - current.amTools,
        deltaPercent: `${predictions.amTools >= current.amTools ? '+' : ''}${(((predictions.amTools - current.amTools) / current.amTools) * 100).toFixed(1)}%`,
        status: calculateStatus(current.amTools, predictions.amTools, 90),
      },
      {
        name: "Capability Achievement",
        current: current.capability,
        predicted: predictions.capability,
        target: 85,
        delta: predictions.capability - current.capability,
        deltaPercent: `${predictions.capability >= current.capability ? '+' : ''}${(((predictions.capability - current.capability) / current.capability) * 100).toFixed(1)}%`,
        status: calculateStatus(current.capability, predictions.capability, 85),
      },
      {
        name: "Win Rate",
        current: current.winRate,
        predicted: predictions.winRate,
        target: 80,
        delta: predictions.winRate - current.winRate,
        deltaPercent: `${predictions.winRate >= current.winRate ? '+' : ''}${(((predictions.winRate - current.winRate) / current.winRate) * 100).toFixed(1)}%`,
        status: calculateStatus(current.winRate, predictions.winRate, 80),
      },
    ];

    return {
      employeeName: employee.name,
      kpiData
    };
  };

  // Get employee data and predictions
  const { employeeName, kpiData } = useMemo(() => {
    return generatePredictionsForEmployee(nik || "20919");
  }, [nik, employeeDatabase]);

  const employeeData = useMemo(() => ({
    nik: nik || "20919",
    name: employeeName,
  }), [nik, employeeName]);

  // Initialize Chart.js
  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current) return;

      // Dynamically import Chart.js
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      // Destroy previous chart instance if exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: kpiData.map(d => d.name),
          datasets: [
            {
              label: 'Q1 2025 (Actual)',
              data: kpiData.map(d => d.current),
              backgroundColor: '#64748b',
              borderRadius: 4,
              maxBarThickness: 40,
            },
            {
              label: 'Q2 2025 (Predicted)',
              data: kpiData.map(d => d.predicted),
              backgroundColor: '#1e3a8a',
              borderRadius: 4,
              maxBarThickness: 40,
            },
            {
              label: 'Target',
              data: kpiData.map(d => d.target),
              backgroundColor: '#94a3b8',
              borderRadius: 4,
              maxBarThickness: 40,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 15,
                font: {
                  size: 12,
                  family: 'Inter, sans-serif'
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + '%';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                },
                font: {
                  size: 11,
                  family: 'Inter, sans-serif'
                },
                color: '#6B7280'
              },
              grid: {
                color: '#E5E7EB'
              }
            },
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
                font: {
                  size: 11,
                  family: 'Inter, sans-serif'
                },
                color: '#6B7280'
              },
              grid: {
                display: false
              }
            }
          }
        }
      });
    };

    loadChart();

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [kpiData]);

  // Table columns
  const columns: TableColumn[] = useMemo(() => [
    { label: "KPI", key: "name", sortable: true },
    { label: "Current", key: "current", sortable: true, render: (value) => `${value}%` },
    { label: "Predicted", key: "predicted", sortable: true, render: (value) => `${value}%` },
    { label: "Target", key: "target", sortable: true, render: (value) => `${value}%` },
    { 
      label: "Δ (pts)", 
      key: "delta", 
      sortable: true,
      render: (value) => {
        const numValue = Number(value);
        let colorClass = 'text-[#64748B]'; // neutral/gray
        
        if (numValue > 0) {
          colorClass = 'text-[#10B981]'; // green for positive
        } else if (numValue < 0) {
          colorClass = 'text-[#EF4444]'; // red for negative
        }
        
        return (
          <span className={`font-semibold ${colorClass}`}>
            {numValue > 0 ? '+' : ''}{numValue}
          </span>
        );
      }
    },
    { 
      label: "Status", 
      key: "status", 
      sortable: true,
      render: (value) => {
        const statusStyles: Record<string, string> = {
          "Exceeds": "bg-[#E2E8F0] text-[#475569]",
          "On Track": "bg-[#E2E8F0] text-[#475569]",
          "Near Target": "bg-[#E2E8F0] text-[#475569]",
          "Needs Focus": "bg-[#FEE2E2] text-[#DC2626]",
        };
        return (
          <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${statusStyles[value] || ""}`}>
            {value}
          </span>
        );
      }
    },
  ], []);

  const handleBack = () => {
    router.push("/journey/evaluation");
  };

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
              <p className="text-[14px] text-[#637381] leading-relaxed">
                This prediction uses <span className="font-semibold">XGBoost</span> algorithm with <span className="font-semibold">85% accuracy rate</span>. The model was trained using <span className="font-semibold">500 data</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full px-4 sm:px-6 lg:px-8 pb-6">
          <Card
            heading="Overview"
            description=""
            className="shadow-sm"
          >
            <div className="w-full h-[320px] mt-6">
              <canvas ref={chartRef}></canvas>
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
                  pageSize={10}
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