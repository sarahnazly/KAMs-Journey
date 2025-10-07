"use client";
import React, { useState } from "react";
import clsx from "clsx";
import Stepper from "@/components/dashboard/Stepper";
import { useRouter } from "next/navigation";

// Features definitions
const features = [
  {
    key: "feature-importance",
    name: "Feature Importance Analysis",
    description: "Analyze the importance level of each feature in the model",
    detail:
      "Identify which features have the most influence on model predictions using various techniques such as permutation importance, SHAP values, and feature correlation analysis.",
    dependencies: [],
  },
  {
    key: "win-probability",
    name: "Win Probability Prediction",
    description: "Probability of winning prediction based on historical data",
    detail:
      "Build a predictive model to calculate the probability of winning or success based on historical data patterns using advanced classification algorithms.",
    dependencies: ["feature-importance"],
  },
  {
    key: "performance-growth",
    name: "Performance Growth Prediction",
    description: "Performance growth prediction based on data trends",
    detail:
      "Time series analysis and trend forecasting to predict future performance growth using machine learning techniques for temporal data.",
    dependencies: ["feature-importance"],
  },
];

// Stepper steps
const steps = [
  {
    title: "Upload File",
    description: "Select your Excel file containing the dataset for analysis",
  },
  {
    title: "Validation",
    description: "System will validate your data format and structure",
  },
  {
    title: "Choose Feature",
    description: "System will validate your data format and structure",
  },
  {
    title: "Processing",
    description: "Multiple ML algorithms will process your data",
  },
];

const FeatureCard = ({
  feature,
  checked,
  disabled,
  onChange,
  showRequirements,
}: {
  feature: typeof features[0];
  checked: boolean;
  disabled: boolean;
  onChange: (key: string) => void;
  showRequirements: boolean;
}) => (
  <div
    className={clsx(
      "w-full flex items-center gap-4 px-4 py-4 rounded-[14px]",
      checked
        ? "bg-[#F0F9FF] shadow-[0px_4px_10px_rgba(0,0,0,0.10)] outline outline-[#CBD5E1]"
        : "bg-white outline outline-[#CBD5E1]"
    )}
    style={{ marginBottom: "12px" }}
  >
    <label className="flex items-center" style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
      <input
        type="checkbox"
        className="peer accent-[#16396E] w-6 h-6"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(feature.key)}
        style={{ width: "24px", height: "24px" }}
      />
    </label>
    <div className="flex-1 min-w-0 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {showRequirements && (
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[#64748B]"
              style={{
                fontSize: "11px",
                fontFamily: "Inter",
                fontWeight: "400",
                lineHeight: "16px",
                marginRight: "6px",
              }}
            >
              Requirements:
            </span>
            <span
              className="px-1.5 py-0.5 rounded-[8px] outline outline-[#3B5C91] text-[#16396E] bg-white"
              style={{
                fontSize: "11px",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "16px",
              }}
            >
              Feature Importance Analysis
            </span>
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span
            style={{
                color: checked ? "#16396E" : "#0F172A",
                fontSize: "17px",
                fontFamily: "Inter",
                fontWeight: "700",
                lineHeight: "22px",
            }}
          >
            {feature.name}
          </span>
          <span
            style={{
              color: "#0F172A",
              fontSize: "13px",
              fontFamily: "Inter",
              fontWeight: "400",
              lineHeight: "20px",
            }}
          >
            {feature.description}
          </span>
        </div>
        <div
          style={{
            height: "0px",
            outline: "1px solid #CBD5E1",
            outlineOffset: "-0.5px",
            width: "100%",
          }}
        ></div>
      </div>
      <span
        style={{
          color: "#0F172A",
          fontSize: "13px",
          fontFamily: "Inter",
          fontWeight: "400",
          lineHeight: "20px",
        }}
      >
        {feature.detail}
      </span>
    </div>
  </div>
);

const ChooseFeaturePage = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["feature-importance"]);
  const router = useRouter();

  // Handle feature selection with dependencies
  const handleFeatureChange = (key: string) => {
    let newSelected = [...selectedFeatures];
    if (newSelected.includes(key)) {
      // Unselecting: remove and also dependent features
      if (key === "feature-importance") {
        newSelected = [];
      } else {
        newSelected = newSelected.filter((f) => f !== key);
      }
    } else {
      // Selecting: add feature and its dependency if needed
      if (key === "feature-importance") {
        newSelected.push(key);
      } else {
        // Add dependency if not present
        features
          .find((f) => f.key === key)!
          .dependencies.forEach((dep) => {
            if (!newSelected.includes(dep)) newSelected.push(dep);
          });
        newSelected.push(key);
      }
    }
    // Remove duplicates
    setSelectedFeatures([...new Set(newSelected)]);
  };

  // Button disabled if nothing selected
  const isProcessingDisabled = selectedFeatures.length === 0;

  // On Start Processing button click
  const handleStartProcessing = () => {
    router.push("/input/progress");
  };

  return (
    <div className="w-full flex flex-col items-center mb-12">
      {/* Stepper */}
      <div className="w-full max-w-[1320px] mx-auto mt-[40px] mb-[40px]">
        <Stepper steps={steps} activeStep={2} />
      </div>

      {/* Main Section */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <span
          style={{
            color: "#0F172A",
            fontSize: "48px",
            fontFamily: "Inter",
            fontWeight: "700",
            lineHeight: "56px",
            textAlign: "center",
          }}
        >
          Choose Feature
        </span>
        <span
          style={{
            color: "#64748B",
            fontSize: "22px",
            fontFamily: "Inter",
            fontWeight: "400",
            lineHeight: "30px",
            textAlign: "center",
          }}
        >
          Choose the feature you want to process
        </span>
      </div>
      <div
        className="w-full max-w-6xl bg-white rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.10)] flex flex-col gap-6 px-[30px] py-[22px]"
      >
        <div className="flex flex-col gap-2">
          <span
            style={{
              color: "black",
              fontSize: "24px",
              fontFamily: "Inter",
              fontWeight: "700",
              lineHeight: "30px",
            }}
          >
            Select Machine Learning Features
          </span>
          <span
            style={{
              color: "black",
              fontSize: "15px",
              fontFamily: "Inter",
              fontWeight: "400",
              lineHeight: "22px",
            }}
          >
            Select the features you want to run. Some features have dependencies on each other.
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.key}
              feature={feature}
              checked={selectedFeatures.includes(feature.key)}
              disabled={
                feature.dependencies.length > 0 &&
                !feature.dependencies.every((dep) => selectedFeatures.includes(dep))
              }
              onChange={handleFeatureChange}
              showRequirements={feature.dependencies.length > 0}
            />
          ))}
        </div>
        <button
          className={clsx(
            "w-full py-[12px] rounded-[8px] flex items-center justify-center gap-2 transition",
            isProcessingDisabled
              ? "bg-[#CBD5E1] cursor-not-allowed"
              : "bg-[#02214C] hover:bg-[#16396E] cursor-pointer"
          )}
          style={{
            paddingLeft: "30px",
            paddingRight: "30px",
            color: "#fff",
            fontSize: "17px",
            fontFamily: "Inter",
            fontWeight: "600",
            lineHeight: "24px",
            marginTop: "12px",
          }}
          disabled={isProcessingDisabled}
          onClick={handleStartProcessing}
        >
          Start Processing
        </button>
      </div>
    </div>
  );
};

export default ChooseFeaturePage;