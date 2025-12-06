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

  // Final display probability (100 if WIN, 0 if LOSE, likelihood otherwise)
  winProbability: number;

  // ML model likelihood (for WIN/LOSE explanation)
  likelihoodLabel: "WIN" | "LOSE" | null;
  likelihoodPct: number | null;

  factors: Factor[];

  modelName: string;      
  modelACC: number;       
}

const WinProbabilityPopup: React.FC<WinProbabilityPopupProps> = ({
  isOpen,
  onClose,
  projectId,
  winProbability,
  likelihoodLabel,
  likelihoodPct,
  factors,
  modelName,
  modelACC,
}) => {
  if (!isOpen) return null;

  const tableData = useMemo(
    () =>
      factors.map((f) => ({
        positive: f.positive,
        risk: f.risk,
      })),
    [factors]
  );

  const columns: WinProbabilityTableColumn[] = [
    { label: "Positive Factors", key: "positive", sortable: true },
    { label: "Risk Factors", key: "risk", sortable: true },
  ];

  const ModelNamePretty = modelName?.toUpperCase() ?? "-";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[15px] w-[90%] md:w-[60%] max-h-[90vh] overflow-y-auto shadow-lg flex flex-col">

          <div className="px-8 pt-8 pb-6 flex flex-col gap-6">
            <h2 className="text-black text-2xl font-bold">
              Win Probability Analysis – {projectId}
            </h2>

            {/* Display Probability */}
            <div className="flex flex-col gap-1.5">

              <div className="flex justify-between items-center">
                <h3 className="text-[#64748B] font-bold">Predicted Win Probability</h3>

                <div className="text-[#02214C] text-2xl font-bold">
                  {winProbability}%
                </div>
              </div>

              <ProgressBar 
                percent={winProbability} 
                color="#16396E" 
                background="#CBD5E1"
                height={12}
              />

              {/* Likelihood explanation */}
              {likelihoodLabel && likelihoodPct !== null ? (
                <p className="text-xs text-[#64748B] mt-1">
                  Kesesuaian karakteristik project dengan kelas <b>{likelihoodLabel}</b>: <b>{likelihoodPct}%</b>.
                </p>
              ) : (
                <p className="text-xs text-[#64748B] mt-1">
                  Based on machine learning analysis of historical project data.
                </p>
              )}
            </div>

            {/* Factors */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[#64748B] font-bold">Factors Analysis</h3>
              <WinProbabilityTable columns={columns} data={tableData} loading={false} />
            </div>

            {/* MODEL INFO */}
            <InfoAlert
              title="ML Model"
              message={
                <span className="text-xs leading-relaxed">
                  This prediction uses <b>{ModelNamePretty}</b> with <b>accuracy{" "}
                  {Number(modelACC ?? 0).toFixed(4)}</b>.
                </span>
              }
              className="!px-6 !py-3.5"
            />
          </div>

          {/* Close */}
          <div className="px-8 pb-8 pt-2">
            <Button onClick={onClose} variant="primary" size="lg" className="w-full">
              Close
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default WinProbabilityPopup;
