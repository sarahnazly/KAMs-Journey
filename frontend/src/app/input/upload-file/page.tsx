"use client";
import React, { useState } from "react";
import Stepper from "@/components/dashboard/Stepper";
import FileUploader from "@/components/upload/FileUploader";
import { useRouter } from "next/navigation";

const steps = [
  { title: "Upload File", description: "Select your Excel file containing the dataset for analysis" },
  { title: "Validation", description: "System will validate your data format and structure" },
  { title: "Choose Feature", description: "System will validate your data format and structure" },
  { title: "Processing", description: "Multiple ML algorithms will process your data" },
];

export default function UploadExcelFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Simulasi upload
  const handleFileUploaded = (f: File) => {
    setFile(f);
    setProgress(0);
    setUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 10) + 5;
      if (prog >= 100) {
        setProgress(100);
        setUploading(false);
        clearInterval(interval);
        setTimeout(() => {
          router.push("/input/data-validation");
        }, 700);
      } else {
        setProgress(prog);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col">
      {/* Stepper */}
      <div className="w-full flex justify-center pt-12 pb-6">
        <div className="max-w-5xl w-full">
          <Stepper steps={steps} activeStep={0} />
        </div>
      </div>
      {/* Title & subtitle */}
      <div className="flex flex-col items-center justify-center mt-2">
        <div className="text-[48px] font-bold text-[#132B50] leading-tight text-center mb-2">Upload Excel File</div>
        <div className="text-[22px] text-[#64748B] text-center">Upload your Excel file to start machine learning analysis.</div>
      </div>
      {/* FileUploader */}
      <div className="flex flex-1 items-start justify-center mt-8 mb-20">
        <FileUploader
          onFileUploaded={handleFileUploaded}
          uploading={uploading}
          progress={progress}
          file={file}
        />
      </div>
    </div>
  );
}