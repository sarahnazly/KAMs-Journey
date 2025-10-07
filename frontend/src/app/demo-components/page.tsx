"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/common/Card";
import Table, { TableColumn } from "@/components/dashboard/Table";
import InfoAlert from "@/components/dashboard/InfoAlert";
import WarningAlert from "@/components/dashboard/WarningAlert";
import FilterYear from "@/components/dashboard/FilterYear";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import SearchBar from "@/components/dashboard/SearchBar";
import Stepper from "@/components/dashboard/Stepper";
import Toast, { ToastType } from "@/components/common/Toast";
import TabStage from "@/components/dashboard/TabStage";
import PopupConfirmation from "@/components/modal/PopUpConfirmation"; 
import PopUpWindow from "@/components/modal/PopUpWindow";
import FeatureImportanceSection from "@/components/dashboard/FeatureImportance";
import { Button } from "@/components/common/Button";
import { Inter } from "next/font/google";
import { Upload, ArrowRight } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export default function HomePage() {
  // Data dinamis
  const [data, setData] = useState<Record<string, any>[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Stepper
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Upload File", description: "Select your Excel file containing the dataset for analysis" },
    { title: "Validation", description: "System will validate your data format and structure" },
    { title: "Choose Feature", description: "System will validate your data format and structure" },
    { title: "Processing", description: "Multiple ML algorithms will process your data" },

  ]

  // Toast
  const [toast, setToast] = useState<{ open: boolean; title: string; message: string; type: ToastType }>({
    open: false, title: "", message: "", type: "success"
  });
  const showToast = (title: string, message: string, type: ToastType) =>
    setToast({ open: true, title, message, type });
  const closeToast = () => setToast({ ...toast, open: false });

  // Popup Confirmation
  const [popupOpen, setPopupOpen] = useState(false);
  // Search Bar
  const [search, setSearch] = useState("");

  // Filter quarter
  const [quarter, setQuarter] = useState<string>("Q1");

  // Filter tahun
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // TabStage
  const [stage, setStage] = useState("Onboarding");
  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    showToast("Berhasil", `Pindah ke stage ${newStage}`, "success");
  };

  // Pop-Up Window
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  // Table columns dinamis
  const columns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Basic Understanding", key: "score1", sortable: true },
    { label: "Twinning", key: "score2", sortable: true },
    { label: "Customer Matching", key: "score3", sortable: true }
  ];

  // Data dummy untuk isi pop-up tabel 
  const detailData = [ 
    { no: 1, assessmentTime: "2024-01-10", score: 85 }, 
    { no: 2, assessmentTime: "2024-02-14", score: 90 }, 
    { no: 3, assessmentTime: "2024-03-20", score: 88 }, 
  ];

  const features = [
    { name: "Visiting Customer", importance: 0.39, description: "Level of understanding of the concept of direct customer visits, aimed at building closer relationships and gaining deeper insights into customer needs." },
    { name: "Account Profile", importance: 0.17, description: "Comprehensive profile of customer accounts." },
    { name: "Sales Funnel", importance: 0.13, description: "Effectiveness in moving prospects through the sales process." },
    { name: "Account Plan", importance: 0.11, description: "Quality and execution of account planning." },
    { name: "Bidding Management", importance: 0.09, description: "Efficiency in managing customer bids." },
    { name: "Customer Matching", importance: 0.06, description: "Ability to match customer needs with solutions." },
    { name: "Customer Introduction", importance: 0.05, description: "Effectiveness in introducing customers to products or services." }
  ];
  const model = { name: "XGBoost", accuracy: 0.85, trainCount: 500 };
  const guidanceFeatureImportance = "These factors show what most influences success in the onboarding stage. Focus on the top ones to improve how quickly and effectively employees start their roles.";
  const guidanceFeature = "Penjelasan fitur detail di sini...";

  // Simulasi ambil data
  useEffect(() => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (year === 2024) {
        setError(`Gagal mengambil data untuk periode ${quarter} tahun ${year}.`);
        setData(null);
        setLoading(false);
        return;
      } 
      if (year === 2023) {
        setData([]);
        setLoading(false);
        return;
      }
      const allData = [
        { nik: "20919", nama: "Ratu Nadya Anjania", score1: 90, score2: 80, score3: 86, quarter: "Q1" },
        { nik: "20920", nama: "Budi Santoso", score1: 85, score2: 75, score3: 81, quarter: "Q2" },
        { nik: "20921", nama: "Nicholas Saputra", score1: 92, score2: 82, score3: 90, quarter: "Q3" },
        { nik: "20922", nama: "Pinky Siwi Nastiti", score1: 88, score2: 78, score3: 85, quarter: "Q4" },
        { nik: "20923", nama: "Anindya Maulida Widyatmoko", score1: 90, score2: 80, score3: 86, quarter: "Q1" },
        { nik: "20924", nama: "Sarah Nazly Nuraya", score1: 85, score2: 75, score3: 81, quarter: "Q2" },
        { nik: "20925", nama: "Celina", score1: 92, score2: 82, score3: 90, quarter: "Q3" },
        { nik: "20926", nama: "Alya Ghina", score1: 88, score2: 78, score3: 85, quarter: "Q4" },
      ];
      let filtered = allData.filter((row) => row.quarter === quarter);
      if (search) {
        filtered = filtered.filter(
          row =>
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.nik.includes(search)
        );
      }
      setData(filtered);
      setLoading(false);
    }, 1200);
  }, [year, quarter, stage, search]);

  // Detail action
  const handleDetail = (row: Record<string, any>) => {
    setIsPopUpOpen(true);
  };

  // Button click handler for demo
  const handleButtonClick = (type: string) => {
    showToast("Button Clicked", `You clicked the ${type} button!`, "success");
  };

  // Handler PopupConfirmation
  const handlePopupConfirm = () => {
    setPopupOpen(false);
    showToast("Konfirmasi Berhasil", "Anda menekan tombol Confirm pada popup.", "success");
  };
  const handlePopupCancel = () => {
    setPopupOpen(false);
    showToast("Popup Ditutup", "Anda membatalkan aksi pada popup.", "info");
  };

  return (
    <div className={`min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-start pt-8 gap-6 ${inter.className}`}>

      {/* SearchBar, Year, and Quarter Filter Card */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]" style={{ outlineOffset: -1 }}>
          <div className="flex-1 flex flex-col items-start">
            <div className="w-full text-black text-[20px] font-semibold leading-[30px]">Search KAMs</div>
            <SearchBar value={search} onChange={setSearch} className="w-full" />
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-[200px]">
              <div className="text-black text-[20px] font-semibold leading-[24px]">Tahun</div>
              <div className="w-full flex items-center justify-between gap-[72px] bg-white rounded-[5px] border-[#CBD5E1] mt-1">
                <FilterYear value={year} onChange={setYear} />
              </div>
            </div>
            <div className="w-[200px]">
              <div className="text-black text-[20px] font-semibold leading-[24px]">Periode</div>
              <div className="w-full flex items-center justify-between gap-[72px] bg-white rounded-[5px] border-[#CBD5E1] mt-1">
                <FilterQuarter value={quarter} onChange={setQuarter} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol demo popup di atas halaman */}
      <div className="flex flex-row gap-3 mb-2">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded font-semibold"
          onClick={() => setPopupOpen(true)}
        >
          Demo Popup Confirmation
        </button>
      </div>

      {/* Tombol uji Toast di bagian atas halaman */}
      <div className="flex flex-row gap-3 mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded font-semibold"
          onClick={() =>
            showToast("Aksi berhasil!", "Data berhasil disimpan!", "success")
          }
        >
          Uji Success Toast
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
          onClick={() =>
            showToast("Aksi gagal!", "Terjadi kesalahan pada server. Silakan coba lagi.", "error")
          }
        >
          Uji Error Toast
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded font-semibold"
          onClick={() =>
            showToast("Info!", "Perlu informasi tambahan sebelum melanjutkan.", "info")
          }
        >
          Uji Info Toast
        </button>
      </div>

      {/* Info & warning alert */}
      <div className="max-w-[1100px] w-full flex flex-col items-center gap-4">
        <InfoAlert
          message={
            <>
              This prediction uses <span className="font-bold">XGBoost</span> algorithm with <span className="font-bold">85% accuracy rate</span>. The model was trained using <span className="font-bold">500 data</span>.
            </>
          }
        />
        <WarningAlert
          message="Input dokumen tidak konsisten. Silakan cek kembali data Anda sebelum melanjutkan."
        />
      </div>

      {/* TabStage align center */}
      <div className="w-full flex items-center justify-center mb-4">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Table align center */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <Card heading="Daftar Account Manager" description="Data Account Manager berdasarkan periode yang dipilih">
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={columns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* PopUpWindow */} 
      <PopUpWindow 
        title="Detail Pop-Up Example" 
        isOpen={isPopUpOpen} 
        onClose={() => setIsPopUpOpen(false)} 
      > 
        <div className="overflow-x-auto"> 
          <table className="w-full border-collapse rounded-[10px] overflow-hidden"> 
            <thead> 
              <tr className="bg-[#02214C] text-center text-white font-semibold text-[16px]"> 
                <th className="px-4 py-3">No.</th> 
                <th className="px-4 py-3">Assessment Time</th> 
                <th className="px-4 py-3">Score</th> 
              </tr> 
            </thead> 
            <tbody> 
              {detailData.map((row, idx) => ( 
                <tr 
                  key={row.no} 
                  className={`${ 
                    idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]" 
                    } text-center text-[15px] text-[#334155]`} 
                > 
                  <td className="px-4 py-3">{row.no}</td> 
                  <td className="px-4 py-3">{row.assessmentTime}</td> 
                  <td className="px-4 py-3">{row.score}</td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
        </div> 
      </PopUpWindow>

      {/* Button Demo Section */}
      <div className="w-full flex items-center justify-center">
        <div className="max-w-[1100px] w-full flex flex-col gap-6">
          <h2 className="text-black text-[24px] font-semibold leading-[30px]">Button</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="primary" onClick={() => handleButtonClick("Primary")}>
              <Upload size={20} />
              Upload
            </Button>
            <Button variant="secondary" onClick={() => handleButtonClick("Secondary")}>
              Start Processing
              <ArrowRight size={20} />
            </Button>
            <Button variant="tertiary" onClick={() => handleButtonClick("Tertiary")}>
              <Upload size={20} />
              Button
            </Button>
            <Button variant="destructive" onClick={() => handleButtonClick("Delete")}>
              Retry
              <ArrowRight size={20} />
            </Button>
            <Button variant="ghost" onClick={() => handleButtonClick("Ghost")}>
              <Upload size={20} />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Info & Warning Alert */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full flex flex-col gap-4">

          <h2 className="text-black text-[24px] font-semibold mb-4">
            Info & Warning Alert
          </h2>
          
          <div className="w-full flex justify-center">
            <InfoAlert
              message={
                <>
                  This prediction uses <span className="font-bold">XGBoost</span> algorithm with{" "}
                  <span className="font-bold">85% accuracy rate</span>. The model was trained using{" "}
                  <span className="font-bold">500 data</span>.
                </>
              }
            />
          </div>

          <div className="w-full flex justify-center">
            <WarningAlert
              message="Input dokumen tidak konsisten. Silakan cek kembali data Anda sebelum melanjutkan."
            />
          </div>

        </div>
      </div>
      
      {/* Stepper */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1100px] w-full">
          <h2 className="text-black text-[24px] font-semibold mb-4">Stepper</h2>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={setActiveStep}
          />
        </div>
      </div>

      {/* Popup Confirmation */}
      <PopupConfirmation
        open={popupOpen}
        title="Format File Tidak Valid!"
        message="Pastikan format file Anda sesuai dengan ketentuan."
        confirmLabel="Ya"
        cancelLabel="Kembali"
        onConfirm={handlePopupConfirm}
        onCancel={handlePopupCancel}
        onClose={handlePopupCancel}
      />
      {/* Buttons for demo stepper */}
      <div className="flex gap-4 mt-4 mb-4">
        <Button
          variant="secondary"
          onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
        >
          Next
        </Button>
      </div>

    {/* Demo Feature Importance Section */}
      <div className="w-full flex justify-center">
        <div className="max-w-[1200px] w-full">
          <h2 className="text-black text-[24px] font-semibold mb-4">Feature Importance Section (Demo)</h2>
          <FeatureImportanceSection
            features={features}
            model={model}
            guidanceFeatureImportance={guidanceFeatureImportance}
            guidanceFeature={guidanceFeature}
          />
        </div>
      </div>
      {/* Toast di pojok kanan bawah */}
      {Toast({
        open: toast.open,
        title: toast.title,
        message: toast.message,
        type: toast.type,
        onClose: closeToast
      })}
    </div>
  );
}