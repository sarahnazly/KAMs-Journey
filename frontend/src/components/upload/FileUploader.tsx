"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/common/Button";

interface FileUploaderProps {
  onFileUploaded: (file: File) => void;
  uploading: boolean;
  progress: number;
  file?: File | null;
  error?: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  uploading,
  progress,
  file,
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    if (
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
      ].includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      alert("File harus .xls atau .xlsx");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("Ukuran file maksimal 50MB");
      return;
    }
    onFileUploaded(file);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className="bg-white rounded-[20px] shadow-lg px-10 py-10 flex flex-col items-center"
        style={{ width: 650 }}
      >
        {!file ? (
          <div
            className={`w-full border-2 border-dashed rounded-[20px] flex flex-col items-center justify-center p-12 cursor-pointer transition-all
              ${dragActive ? "border-blue-400 bg-blue-50" : "border-[#94A3B8] bg-white"}`}
            onDragOver={e => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="mb-5 flex items-center justify-center">
              <div
                style={{
                  width: 98,
                  height: 98,
                  background: "var(--Light-3, #F1F5F9)",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={40}
                  height={40}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="var(--Primary-Dusty-Navy, #3B5C91)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
            </div>
            <div className="font-bold text-xl text-black mb-1 text-center">
              Drag &amp; drop your excel file here
            </div>
            <div className="text-[#64748B] text-lg mb-4 text-center">
              or click to browse files
            </div>
            <Button
              type="button"
              variant="secondary"
              size="default"
              className="mb-4"
            >
              Choose File
            </Button>
            <div className="text-[#94A3B8] text-sm">
              Supported formats: .xlsx, .xls (Max size: 50MB)
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              onChange={handleSelectFile}
              disabled={uploading}
            />
            {error && (
              <div className="text-red-500 font-medium mt-2">{error}</div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <div className="bg-[#F0F9FF] rounded-[10px] px-6 py-3 flex items-center gap-4 mb-3">
              {/* Icon file */}
              <svg width={40} height={40} fill="none">
                <rect width="40" height="40" rx="8" fill="#3B5C91" />
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                >
                  XLS
                </text>
              </svg>
              <div className="flex-1">
                <div className="font-bold text-lg text-black">{file.name}</div>
                <div className="text-[#475569] text-base">
                  {formatBytes(file.size)}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-[#475569] mb-1">
                <span>{uploading ? "Uploading..." : "Upload completed"}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-4 bg-[#E2E8F0] rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-4 bg-[#3B5C91] transition-all"
                  style={{
                    width: `${progress}%`,
                    borderRadius: 16,
                    boxShadow:
                      "0px 4px 20px 5px rgba(125,175,255,0.18)"
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;