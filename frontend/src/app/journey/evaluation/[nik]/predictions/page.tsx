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

  // Mock employee data - in production, fetch based on NIK
  const employeeData = useMemo(() => ({
    nik: "20919",
    name: "Ratu Nadya Anjania",
  }), []);

  // KPI Data
  const kpiData: KPIData[] = useMemo(() => [
    {
      name: "Revenue Achievement",
      current: 78,
      predicted: 89,
      target: 90,
      delta: 11,
      deltaPercent: "+14.1%",
      status: "On Track",
    },
    {
      name: "Sales Achievement",
      current: 82,
      predicted: 94,
      target: 90,
      delta: 12,
      deltaPercent: "+14.6%",
      status: "Exceeds",
    },
    {
      name: "Profitability Achievement",
      current: 71,
      predicted: 83,
      target: 85,
      delta: 12,
      deltaPercent: "+16.9%",
      status: "Near Target",
    },
    {
      name: "Collection Rate Achievement",
      current: 68,
      predicted: 76,
      target: 85,
      delta: 8,
      deltaPercent: "+11.8%",
      status: "Needs Focus",
    },
    {
      name: "AM Tools Achievement",
      current: 85,
      predicted: 92,
      target: 90,
      delta: 7,
      deltaPercent: "+8.2%",
      status: "Exceeds",
    },
    {
      name: "Capability Achievement",
      current: 79,
      predicted: 88,
      target: 85,
      delta: 9,
      deltaPercent: "+11.4%",
      status: "Exceeds",
    },
    {
      name: "Win Rate",
      current: 73,
      predicted: 91,
      target: 80,
      delta: 18,
      deltaPercent: "+24.7%",
      status: "Exceeds",
    },
  ], []);

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