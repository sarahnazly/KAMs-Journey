"use client";
import React, { useState } from "react";
import Stepper from "@/components/dashboard/Stepper";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";

const steps = [
  { title: "Upload File", description: "Select your Excel file containing the dataset for analysis" },
  { title: "Validation", description: "System will validate your data format and structure" },
  { title: "Choose Feature", description: "System will validate your data format and structure" },
  { title: "Processing", description: "Multiple ML algorithms will process your data" },
];

const dummyFile = {
  name: "Kuadran_2025_Januari.xlsx",
  size: 3.56 * 1024 * 1024,
};

const validationErrors = [
  {
    title: "Missing Required Column",
    message: "Column 'revenue' is required but not found in the dataset",
    solution: "Add a column named 'revenue' containing your dependent variable"
  },
  {
    title: "Invalid Data Type",
    message: "Column 'age' contains non-numeric values in rows 45, 67, 89",
    solution: "Convert text values to numbers or remove invalid entries"
  },
  {
    title: "Duplicate Column Name",
    message: "Column 'nik' appears twice (columns C and F)",
    solution: "Rename one of the duplicate columns or remove it"
  }
];

export default function DataValidationPage() {
  const [success, setSuccess] = useState(true);
  const router = useRouter();

  const handleCancel = () => router.push("/input/upload-file");
  const handleChooseFeature = () => router.push("/input/choose-feature");
  const handleUploadNewFile = () => router.push("/input/upload-file");

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col">
      {/* Stepper */}
      <div className="w-full flex justify-center pt-12 pb-6">
        <div className="max-w-5xl w-full">
          <Stepper steps={steps} activeStep={1} />
        </div>
      </div>
      {/* Title & subtitle */}
      <div className="flex flex-col items-center justify-center mt-2">
        <div className="text-[48px] font-bold text-[#132B50] leading-tight text-center mb-2">Data Validation</div>
        <div className="text-[22px] text-[#64748B] text-center">Validation results for your uploaded Excel file</div>
      </div>

      <div className="flex flex-col items-center w-full mt-8">
        {/* Card */}
        <div className="w-full max-w-3xl mb-1">
          <div className="bg-white rounded-[15px] shadow-lg px-8 py-8 mb-8">
            <div className="flex flex-row justify-between items-start mb-4">
              <div>
                <div className="font-bold text-2xl text-black mb-1">Data Validation</div>
                <div className="text-[#475569] text-lg">File: {dummyFile.name} ({(dummyFile.size / (1024 * 1024)).toFixed(2)} MB)</div>
              </div>
              {!success && (
                <Button
                  variant="primary"
                  size="default"
                  className="mb4"
                  onClick={handleUploadNewFile}
                >
                  Upload New File
                </Button>
              )}
            </div>
            {/* Success/Failed Card */}
            {success ? (
              <div className="w-full bg-green-100 border border-green-400 rounded-[8px] px-6 py-4 flex items-center gap-3 mb-2">
                {/* Success icon */}
                <svg width={28} height={28} fill="none">
                  <circle cx={14} cy={14} r={14} fill="#22C55E" />
                  <path d="M8.5 14.5L12 18l7-7" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <div className="font-bold text-green-700 text-lg">Validation Success</div>
                  <div className="text-green-600 text-base">File ready to be processed with machine learning algorithms</div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-red-50 border border-red-400 rounded-[8px] px-6 py-4 flex items-center gap-3 mb-2">
                <svg width={28} height={28} fill="none">
                  <circle cx={14} cy={14} r={14} fill="#F23030" />
                  <path d="M14 9v5m0 4h.01" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <div className="font-bold text-red-600 text-lg">Validation Failed</div>
                  <div className="text-[#F56060] text-base">
                    Please fix the errors below before proceeding with ML processing
                  </div>
                </div>
              </div>
            )}
            {/* Button untuk success */}
            {success && (
              <div className="flex w-full mt-8 justify-between gap-4">
                <Button
                  variant="tertiary"
                  size="default"
                  className="mb4"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  className="mb4"
                  onClick={handleChooseFeature}
                >
                  Choose Feature
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* Error List */}
        {!success && (
          <div className="w-full max-w-3xl mb-20">
            <div className="bg-white rounded-[15px] shadow-lg px-8 py-8">
              <div className="font-bold text-2xl text-black mb-6">Errors ({validationErrors.length})</div>
              <div className="flex flex-col gap-6">
                {validationErrors.map((err, i) => (
                  <div key={i} className="border-l-4 border-[#D62828] pl-6">
                    <div className="font-bold text-[#B30101] text-xl mb-1">{err.title}</div>
                    <div className="text-[#FF5555] text-base mb-2">{err.message}</div>
                    <div className="text-[#64748B] text-sm"><b>Solution:</b> {err.solution}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}