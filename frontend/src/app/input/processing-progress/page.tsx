"use client";
import React, { useState } from "react";
import Stepper from "@/components/dashboard/Stepper";
import ProgressBar from "@/components/dashboard/ProgressBar";
import AlgorithmCard from "@/components/progress/AlgorithmCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Clock3, RefreshCw } from "lucide-react";

// Tipe status algoritma & fitur
type AlgoStatus = "completed" | "running" | "waiting" | "error";
type ProgressStatus = "completed" | "processing" | "waiting" | "error" | "stopped";

type Algo = { name: string; status: AlgoStatus; percent: number | null };
type FeatureProgress = {
  feature: string;
  description: string;
  status: ProgressStatus;
  algorithms: Algo[];
};

const fileInfo = {
  name: "Kuadran_2025_Januari.xlsx",
  size: "3.56 MB",
};
const steps = [
  { title: "Upload File", description: "Select your Excel file containing the dataset for analysis" },
  { title: "Validation", description: "System will validate your data format and structure" },
  { title: "Choose Feature", description: "System will validate your data format and structure" },
  { title: "Processing", description: "Multiple ML algorithms will process your data" }
];

const initialFeatureProgress: FeatureProgress[] = [
  {
    feature: "Feature Importance",
    description: "Analyze the importance level of each feature in the model",
    status: "completed",
    algorithms: [
      { name: "XGBoost", status: "completed", percent: 80.65 },
      { name: "Random Forest", status: "completed", percent: 80.65 },
      { name: "Decision Tree", status: "completed", percent: 80.65 },
      { name: "SVR", status: "completed", percent: 80.65 },
      { name: "Linear Regression", status: "completed", percent: 80.65 },
    ],
  },
  {
    feature: "Win Probability Prediction",
    description: "Predict win probability based on historical data",
    status: "processing",
    algorithms: [
      { name: "XGBoost", status: "completed", percent: 80.65 },
      { name: "Random Forest", status: "completed", percent: 80.65 },
      { name: "Decision Tree", status: "completed", percent: 80.65 },
      { name: "SVR", status: "completed", percent: 80.65 },
      { name: "Linear Regression", status: "running", percent: null },
    ],
  },
  {
    feature: "Performance Growth Prediction",
    description: "Predict performance growth based on data trends",
    status: "waiting",
    algorithms: [
      { name: "XGBoost", status: "waiting", percent: null },
      { name: "Random Forest", status: "waiting", percent: null },
      { name: "Decision Tree", status: "waiting", percent: null },
      { name: "SVR", status: "waiting", percent: null },
      { name: "Linear Regression", status: "waiting", percent: null },
    ],
  },
];

const errorDetail = {
  algorithm: "Random Forest",
  feature: "Performance Growth Prediction",
  message: "Insufficient memory to process dataset with Random Forest algorithm",
  stack: [
    "MemoryError at line 42 in RandomForest.fit()",
    "at MLProcessor.process()",
    "at FeatureProcessor.run()",
  ],
  time: "23/09/2025, 10.10.23",
};

const FeatureProgressCard = ({
  feature,
  description,
  status,
  algorithms,
  onRetry,
}: {
  feature: string;
  description: string;
  status: ProgressStatus;
  algorithms: Algo[];
  onRetry?: (algorithm: string) => void;
}) => {
  let chipText = "text-[#16396E]";
  let chipBg = "bg-[#E0E7FF]";
  let chipLabel = "processing...";
  if (status === "completed") {
    chipText = "text-white";
    chipBg = "bg-[#02214C]";
    chipLabel = "completed";
  } else if (status === "waiting") {
    chipText = "text-[#64748B]";
    chipBg = "bg-[#CBD5E1]";
    chipLabel = "waiting";
  } else if (status === "error") {
    chipText = "text-white";
    chipBg = "bg-[#EF4444]";
    chipLabel = "Error";
  }
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-[16px] shadow-[0px_4px_10px_rgba(0,0,0,0.08)] px-6 py-6 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[18px] font-bold text-[#0F172A]">{feature}</span>
          <div className="text-sm text-[#64748B] font-normal">{description}</div>
        </div>
        <span className={`${chipText} ${chipBg} px-4 py-1.5 rounded-[8px] text-sm font-semibold`}>
          {chipLabel}
        </span>
      </div>
      {/* Responsive flex wrap for algorithm cards */}
      <div className="flex flex-wrap gap-4 mb-4 w-full">
        {algorithms.map((alg) => (
          <div className="basis-[160px] grow shrink-0" key={alg.name}>
            <AlgorithmCard
              name={alg.name}
              status={alg.status}
              percent={alg.percent}
              onRetry={onRetry ? () => onRetry(alg.name) : undefined}
            />
          </div>
        ))}
      </div>
      {(status === "processing" || status === "completed") && (
        <>
          <ProgressBar
            percent={
              Math.round(
                (algorithms.filter((alg) => alg.status === "completed").length / algorithms.length) *
                  100
              )
            }
          />
          <div className="text-xs text-[#64748B] mt-2">{`${algorithms.filter((alg) => alg.status === "completed").length}/${algorithms.length} algorithms`}</div>
        </>
      )}
    </div>
  );
};

const ErrorDetailCard = ({ error, onRetry }: { error: typeof errorDetail; onRetry: () => void }) => (
  <div className="w-full max-w-6xl mx-auto bg-[#FFF6F6] rounded-[16px] border border-[#EF4444] p-8 mb-8">
    <span className="block text-xl font-bold text-[#EF4444] mb-2">
      Memory Error in {error.algorithm}
    </span>
    <div className="flex items-center gap-2 mb-3 text-base text-[#64748B]">
      <span><Clock3 size={16} /></span>
      <span>{error.time}</span>
    </div>
    <div className="mb-3">
      <span className="block text-[#EF4444] font-semibold mb-1">Error Message:</span>
      <span className="block bg-[#FEE2E2] px-4 py-2 rounded text-base text-[#EF4444] font-semibold mb-3">
        {error.message}
      </span>
      <span className="block font-semibold mb-2">Stack Trace:</span>
      <pre className="bg-[#0F172A] text-white rounded px-4 py-2 text-sm overflow-x-auto font-mono mb-3">
        {error.stack.join("\n")}
      </pre>
    </div>
    <Button
      variant="primary"
      onClick={onRetry}
    >
      <RefreshCw size={16} />
      Retry Fitur
    </Button>
  </div>
);

const ProgressPage = () => {
  const router = useRouter();

  const [overallPercent, setOverallPercent] = useState(60);
  const [overallStatus, setOverallStatus] = useState<ProgressStatus>("processing");
  const [featureProgress, setFeatureProgress] = useState<FeatureProgress[]>(initialFeatureProgress);
  const [showError, setShowError] = useState(false);

  const handleRetry = (algorithm: string) => {
    setShowError(false);
    setFeatureProgress((prev) =>
      prev.map((item) =>
        item.feature === errorDetail.feature
          ? {
              ...item,
              algorithms: item.algorithms.map((alg) =>
                alg.name === algorithm ? { ...alg, status: "running", percent: null } : alg
              ),
              status: "processing",
            }
          : item
      )
    );
    setOverallStatus("processing");
    setOverallPercent(65);
  };

  const handleComplete = () => {
    setOverallPercent(100);
    setOverallStatus("completed");
    setFeatureProgress((prev) =>
      prev.map((item) => ({
        ...item,
        status: "completed",
        algorithms: item.algorithms.map((alg) => ({
          ...alg,
          status: "completed",
          percent: 80.65,
        })),
      }))
    );
  };

  const handleError = () => {
    setShowError(true);
    setOverallStatus("stopped");
    setOverallPercent(73);
    setFeatureProgress((prev) =>
      prev.map((item) =>
        item.feature === errorDetail.feature
          ? {
              ...item,
              status: "error",
              algorithms: item.algorithms.map((alg) =>
                alg.name === errorDetail.algorithm
                  ? { ...alg, status: "error", percent: null }
                  : alg
              ),
            }
          : item
      )
    );
  };

  const handleSeeResult = () => {
    router.push("/result");
  };

  return (
    <div className="w-full flex flex-col items-center mb-20">
      {/* Stepper */}
      <div className="w-full flex justify-center pt-12 pb-6">
        <div className="max-w-5xl w-full">
          <Stepper steps={steps} activeStep={3} />
        </div>
      </div>

      {/* Title & subtitle */}
      <div className="flex flex-col items-center justify-center mt-2">
        <div className="text-[48px] font-bold text-[#0F172A] leading-tight text-center mb-2">
          Processing Progress
        </div>
        <div className="text-[22px] text-[#64748B] text-center">
          Your file is being processed by multiple machine learning algorithms
        </div>
      </div>

      {/* Overall Progress */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] flex flex-col gap-2 px-8 py-8 mb-8 mt-8">
        <div className="flex items-center justify-between">
          <span className="text-[24px] font-bold text-[#0F172A]">Overall Progress</span>
          <div className="flex items-center flex-col">
            <span className="text-2xl font-bold text-[#16396E]">{`${overallPercent}%`}</span>
            <span className="text-base text-[#475569] font-normal">
              {overallStatus === "completed"
                ? "Completed"
                : overallStatus === "processing"
                ? "Complete"
                : overallStatus === "stopped"
                ? "Stopped"
                : ""}
            </span>
          </div>
        </div>
        <div className="text-base text-[#475569]">{`File: ${fileInfo.name} (${fileInfo.size})`}</div>
        <ProgressBar percent={overallPercent} />
      </div>

      {/* Progress per Fitur */}
      <div className="w-full max-w-6xl mx-auto">
        <span className="text-[24px] font-bold text-[#0F172A] mb-3 block">Progress per Fitur</span>
        {featureProgress.map((item) => (
          <FeatureProgressCard
            key={item.feature}
            {...item}
            onRetry={showError ? handleRetry : undefined}
          />
        ))}
      </div>

      {/* Error Detail (if error) */}
      {showError && (
        <ErrorDetailCard error={errorDetail} onRetry={() => handleRetry(errorDetail.algorithm)} />
      )}

      {/* See Result Button (if completed) */}
      {overallStatus === "completed" && (
        <button
          className="w-full max-w-6xl mx-auto mt-6 py-[18px] rounded-[8px] flex items-center justify-center gap-2 transition bg-[#02214C] hover:bg-[#16396E] cursor-pointer text-white font-semibold text-lg"
          onClick={handleSeeResult}
        >
          See Result &rarr;
        </button>
      )}

      {/* DEMO: action buttons, remove in production */}
      <div className="flex gap-2 mt-8">
        <button
          className="px-5 py-3 bg-[#22C55E] text-white rounded text-base"
          onClick={handleComplete}
        >
          Simulate Complete
        </button>
        <button
          className="px-5 py-3 bg-[#EF4444] text-white rounded text-base"
          onClick={handleError}
        >
          Simulate Error
        </button>
      </div>
    </div>
  );
};

export default ProgressPage;