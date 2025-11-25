import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface AlgorithmCardProps {
  name: string;
  status: "completed" | "running" | "waiting" | "error";
  percent: number | null;
  onRetry?: () => void;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  name,
  status,
  percent,
  onRetry,
}) => {
  // Style variables
  let outlineColor = "#CBD5E1";
  let outline = `1px solid ${outlineColor}`;
  let outlineOffset = "-1px";
  let borderRadius = 16;
  let statusText = "";
  let statusTextColor = "#475569"; // waiting
  let statusTextWeight = 400;
  let percentTextColor = "#10B981";
  let percentTextWeight = 600;

  if (status === "completed") {
    statusText = "Completed";
    statusTextColor = "#10B981";
    statusTextWeight = 400;
  } else if (status === "running") {
    statusText = "Running..";
    statusTextColor = "#3B5C91";
    statusTextWeight = 400;
  } else if (status === "waiting") {
    statusText = "Waiting";
    statusTextColor = "#475569";
    statusTextWeight = 400;
  } else if (status === "error") {
    statusText = "Error";
    statusTextColor = "#EF4444";
    statusTextWeight = 700;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 8,
        borderRadius,
        outline,
        outlineOffset,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: status === "waiting" ? "center" : "flex-start",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        boxSizing: "border-box",
      }}
    >
      {/* Indicator Area */}
      {(status === "completed" || status === "running") && (
        <div style={{
            width: "100%",
            alignSelf: "stretch",
            display: "inline-flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {status === "completed" && (
                <CheckCircle2 color="#10B981" size={16} />
            )}
            {status === "running" && (
                <Loader2 color="#16396E" size={16} className="animate-spin" />
            )}
            </div>
            <div
            style={{
                width: 10,
                height: 10,
                background: status === "completed" ? "#10B981" : "#16396E",
                borderRadius: "9999px",
            }}
            />
        </div>
    )}
      {/* Card Text */}
      <div
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 5,
          display: "flex",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            textAlign: "center",
            color: "#0F172A",
            fontSize: 16,
            fontFamily: "Inter",
            fontWeight: 600,
            lineHeight: "20px",
            wordWrap: "break-word",
          }}
        >
          {name}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            textAlign: "center",
            color: statusTextColor,
            fontSize: 13,
            fontFamily: "Inter",
            fontWeight: statusTextWeight,
            lineHeight: "18px",
            wordWrap: "break-word",
          }}
        >
          {statusText}
        </div>
        {status === "completed" && percent !== null && (
          <div
            style={{
              alignSelf: "stretch",
              textAlign: "center",
              color: percentTextColor,
              fontSize: 13,
              fontFamily: "Inter",
              fontWeight: percentTextWeight,
              lineHeight: "18px",
              wordWrap: "break-word",
            }}
          >
            {`${percent}%`}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmCard;