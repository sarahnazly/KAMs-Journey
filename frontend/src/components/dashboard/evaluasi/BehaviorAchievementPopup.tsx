"use client";

import React, { useMemo } from "react";
import Table, { TableColumn } from "@/components/dashboard/Table";

interface BehaviorAchievementData {
  no: number;
  assessmentTime: string;
  score: number;
}

interface BehaviorAchievementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeNIK: string;
  data: BehaviorAchievementData[];
  loading?: boolean;
  error?: string;
}

const BehaviorAchievementPopup: React.FC<BehaviorAchievementPopupProps> = ({
  isOpen,
  onClose,
  employeeName,
  employeeNIK,
  data,
  loading = false,
  error = "",
}) => {
  // Define table columns
  const columns: TableColumn[] = useMemo(
    () => [
      {
        label: "No.",
        key: "no",
        sortable: true,
      },
      {
        label: "Assessment Time",
        key: "assessmentTime",
        sortable: true,
      },
      {
        label: "Score",
        key: "score",
        sortable: true,
      },
    ],
    []
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container with 90% scale */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col"
          style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start">
            <div className="flex-1">
              <h2 className="text-[#0F172A] text-xl font-bold font-inter leading-tight">
                Behavior Achievement Details
              </h2>
              <p className="text-[#64748B] text-md font-inter font-normal leading-relaxed mt-1">
                {employeeName} <span className="text-[#94A3B8]">({employeeNIK})</span>
              </p>
            </div>
          </div>

          {/* Content - Fixed height, no scroll, pagination handles data */}
          <div className="px-6 py-4">
            <div className="w-full">
              <Table
                columns={columns}
                data={data}
                loading={loading}
                error={error}
                pageSize={8}
                showAction={false}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#E2E8F0]">
            <button
              onClick={onClose}
              className="w-full px-5 py-2 bg-[#02214C] text-white text-sm font-inter font-semibold rounded-lg hover:bg-[#E9F8FF] hover:text-[#164E9D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#02214C] focus:ring-offset-2"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BehaviorAchievementPopup;