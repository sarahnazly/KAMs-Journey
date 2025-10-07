import React from "react";

interface ProgressBarProps {
  percent: number; // 0-100
  color?: string; // default "#3B5C91"
  background?: string; // default "#E2E8F0"
  height?: number; // default 16
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  color = "#3B5C91",
  background = "#E2E8F0",
  height = 16,
}) => (
  <div
    style={{
      width: "100%",
      height,
      position: "relative",
      borderRadius: 40,
      background: "transparent",
      marginTop: "16px",
      marginBottom: "8px",
    }}
  >
    <div
      style={{
        width: "100%",
        height,
        position: "absolute",
        left: 0,
        top: 0,
        background,
        borderRadius: 40,
      }}
    />
    <div
      style={{
        width: `${percent}%`,
        height,
        position: "absolute",
        left: 0,
        top: 0,
        background: color,
        borderRadius: 40,
        boxShadow: "0px 4px 20px 5px rgba(125,175,255,0.30)",
        transition: "width 0.5s",
      }}
    />
  </div>
);

export default ProgressBar;