"use client";

import React, { useMemo } from "react";
import ProgressBar from "@/components/dashboard/ProgressBar";
import InfoAlert from "@/components/dashboard/InfoAlert";
import WinProbabilityTable, { WinProbabilityTableColumn } from "./WinProbabilityTable";
import { Button } from "@/components/common/Button";

interface Factor {
  positive: string;
  risk: string;
}

interface WinProbabilityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  winProbability: number;
  factors: Factor[];
  modelName?: string;
  modelAccuracy?: number;
}

const WinProbabilityPopup: React.FC<WinProbabilityPopupProps> = ({
  isOpen,
  onClose,
  projectId,
  winProbability,
  factors,
  modelName = "XGBoost",
  modelAccuracy = 85,
}) => {
  // Convert factors to table data format
  const tableData = useMemo(() => {
    return factors.map((factor) => ({
      positive: factor.positive,
      risk: factor.risk,
    }));
  }, [factors]);

  // Define table columns
  const columns: WinProbabilityTableColumn[] = useMemo(
    () => [
      {
        label: "Positive Factors",
        key: "positive",
        sortable: true,
      },
      {
        label: "Risk Factors",
        key: "risk",
        sortable: true,
      },
    ],
    []
  );

  const fontStyle = { fontFamily: "Inter, sans-serif" };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Custom Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[15px] w-[90%] md:w-[60%] max-h-[90vh] overflow-y-auto shadow-lg flex flex-col">
          {/* Content with padding */}
          <div className="px-8 pt-8 pb-6 flex flex-col gap-6">
            {/* Title */}
            <h2 className="text-black text-2xl font-bold font-inter leading-[28.8px]" style={fontStyle}>
              Win Probability Analysis - {projectId}
            </h2>

            {/* Main Content */}
            <div className="flex flex-col gap-5" style={fontStyle}>
              {/* Win Probability Section */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-[#64748B] text-base font-inter font-bold leading-snug"
                      style={fontStyle}
                    >
                      Predicted Win Probability
                    </h3>
                    <div
                      className="text-[#02214C] text-2xl font-inter font-bold leading-tight"
                      style={fontStyle}
                    >
                      {winProbability}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="-mt-1">
                    <ProgressBar
                      percent={winProbability}
                      color="#16396E"
                      background="#CBD5E1"
                      height={12}
                    />
                  </div>
                </div>

                <p
                  className="text-[#64748B] text-xs font-inter font-normal leading-relaxed"
                  style={fontStyle}
                >
                  Based on machine learning analysis of historical project data
                </p>
              </div>

              {/* Factors Analysis Section */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-[#64748B] text-base font-inter font-bold leading-snug"
                  style={fontStyle}
                >
                  Factors Analysis
                </h3>

                {/* WinProbabilityTable */}
                <div className="w-full">
                  <WinProbabilityTable
                    columns={columns}
                    data={tableData}
                    loading={false}
                  />
                </div>
              </div>

              {/* ML Model Info */}
              <div className="w-full -mb-2">
                <InfoAlert
                  title="ML Model"
                  message={
                    <span className="text-xs leading-relaxed" style={fontStyle}>
                      This prediction uses <strong>{modelName}</strong> algorithm with{" "}
                      <strong>{modelAccuracy}%</strong> accuracy rate.
                    </span>
                  }
                  className="max-w-none !px-6 !py-3.5"
                  style={{
                    padding: "14px 24px",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 pt-2">
            <Button
              onClick={onClose}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WinProbabilityPopup;