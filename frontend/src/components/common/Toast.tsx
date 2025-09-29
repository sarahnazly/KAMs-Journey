"use client";

import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  title: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms
  onClose?: () => void;
  open: boolean;
}

function getIcon(type: ToastType) {
  if (type === "success") {
    return React.createElement("svg", { width: 22, height: 22, fill: "none", viewBox: "0 0 22 22" },
      React.createElement("circle", { cx: 11, cy: 11, r: 11, fill: "#22C55E" }),
      React.createElement("path", {
        d: "M7 11.5L10 14L15 9",
        stroke: "#fff",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })
    );
  }
  if (type === "error") {
    return React.createElement("svg", { width: 22, height: 22, fill: "none", viewBox: "0 0 22 22" },
      React.createElement("circle", { cx: 11, cy: 11, r: 11, fill: "#EF4444" }),
      React.createElement("path", {
        d: "M8 8L14 14M14 8L8 14",
        stroke: "#fff",
        strokeWidth: 2,
        strokeLinecap: "round"
      })
    );
  }
  // info
  return React.createElement("svg", { width: 22, height: 22, fill: "none", viewBox: "0 0 22 22" },
    React.createElement("circle", { cx: 11, cy: 11, r: 11, fill: "#16396E" }),
    React.createElement("text", {
      x: 11, y: 16, textAnchor: "middle", fill: "#fff",
      fontSize: 16, fontWeight: "bold", fontFamily: "Inter, Arial, Helvetica, sans-serif"
    }, "i")
  );
}

export function Toast(props: ToastProps) {
  useEffect(() => {
    if (!props.open) return;
    const timer = setTimeout(() => { if (props.onClose) props.onClose(); }, props.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [props.open, props.duration, props.onClose]);

  if (!props.open) return null;

  let bg = "#E9F3FF", border = "#16396E";
  if (props.type === "success") { bg = "#EDFFF4"; border = "#10B981"; }
  if (props.type === "error") { bg = "#FFF1F1"; border = "#EF4444"; }

  return React.createElement("div", {
    className: "fixed bottom-8 right-8 z-50 min-w-[280px] max-w-[380px] border-l-4 rounded-md shadow-lg flex items-center px-5 py-4 gap-3",
    style: {
      background: bg,
      borderLeftColor: border,
      borderLeftWidth: 4,
      borderStyle: "solid",
      transition: "opacity 0.2s"
    },
    role: "alert"
  },
    getIcon(props.type || "info"),
    React.createElement("div", { style: { flex: 1 } },
      React.createElement("div", {
        style: {
          fontFamily: "Inter, Arial, Helvetica, sans-serif",
          fontWeight: 600,
          fontSize: 16,
          color: "#24292F",
          marginBottom: "2px",
        }
      }, props.title),
      React.createElement("div", {
        style: {
          fontFamily: "Inter, Arial, Helvetica, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          color: "#374151",
          marginTop: "2px",
          whiteSpace: "pre-line"
        }
      }, props.message)
    ),
    React.createElement("button", {
      style: { marginLeft: 8, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 2, borderRadius: 3 },
      onClick: props.onClose,
      tabIndex: 0,
      "aria-label": "Close"
    },
      React.createElement("svg", { width: 18, height: 18, fill: "none", viewBox: "0 0 18 18" },
        React.createElement("path", {
          d: "M6 6L12 12M12 6L6 12",
          stroke: "#6B7280", strokeWidth: 2, strokeLinecap: "round"
        })
      )
    )
  );
}

export default Toast;