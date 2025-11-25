"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import Table, { TableColumn } from "@/components/dashboard/Table";
import WinProbabilityPopup from "@/components/dashboard/pelaksanaan/WinProbabilityPopup";
import { ArrowLeftIcon } from "lucide-react";

type Project = {
  idProject: string;
  projectName: string;
  customer: string;
  valueProject: string;
  stage: string;
  jumlahAktivitas: number;
  status: string;
  winProbability: string;
};

type AEData = {
  nik: string;
  nama: string;
  projects: Project[];
};

type SelectedProject = {
  id: string;
  probability: number;
  factors: Array<{ positive: string; risk: string }>;
};

export default function OnDutyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const nik = params?.nik as string;

  const [aeData, setAeData] = useState<AEData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);

  // Dummy data - replace with actual API call
  const allAEData: AEData[] = useMemo(
    () => [
      {
        nik: "20919",
        nama: "Ratu Nadya Anjania",
        projects: [
          {
            idProject: "20919",
            projectName: "Ratu Nadya Anjania",
            customer: "Mabes TNI",
            valueProject: "Rp20.000.000",
            stage: "F0",
            jumlahAktivitas: 86,
            status: "Draft",
            winProbability: "86%",
          },
          {
            idProject: "20919",
            projectName: "Ratu Nadya Anjania",
            customer: "Mabes TNI",
            valueProject: "Rp20.000.000",
            stage: "F1",
            jumlahAktivitas: 90,
            status: "Draft",
            winProbability: "86%",
          },
          {
            idProject: "20919",
            projectName: "Ratu Nadya Anjania",
            customer: "Mabes TNI",
            valueProject: "Rp20.000.000",
            stage: "F2",
            jumlahAktivitas: 86,
            status: "Solusi sudah dibuat",
            winProbability: "86%",
          },
          {
            idProject: "20919",
            projectName: "Ratu Nadya Anjania",
            customer: "Mabes TNI",
            valueProject: "Rp20.000.000",
            stage: "F3",
            jumlahAktivitas: 86,
            status: "Draft",
            winProbability: "86%",
          },
        ],
      },
      {
        nik: "20920",
        nama: "Budi Santoso",
        projects: [
          {
            idProject: "20920",
            projectName: "Budi Santoso Project",
            customer: "PT. ABC",
            valueProject: "Rp15.000.000",
            stage: "F0",
            jumlahAktivitas: 75,
            status: "Draft",
            winProbability: "75%",
          },
          {
            idProject: "20920",
            projectName: "Budi Santoso Project 2",
            customer: "PT. XYZ",
            valueProject: "Rp25.000.000",
            stage: "F1",
            jumlahAktivitas: 80,
            status: "In Progress",
            winProbability: "80%",
          },
        ],
      },
      {
        nik: "20921",
        nama: "Nicholas Saputra",
        projects: [
          {
            idProject: "20921",
            projectName: "Nicholas Project",
            customer: "Bank Indonesia",
            valueProject: "Rp50.000.000",
            stage: "F2",
            jumlahAktivitas: 95,
            status: "Solusi sudah dibuat",
            winProbability: "90%",
          },
        ],
      },
      {
        nik: "20922",
        nama: "Pinky Siwi",
        projects: [
          {
            idProject: "20922",
            projectName: "Pinky Project",
            customer: "Kementerian",
            valueProject: "Rp30.000.000",
            stage: "F1",
            jumlahAktivitas: 88,
            status: "Draft",
            winProbability: "85%",
          },
        ],
      },
    ],
    []
  );

  // Dummy factors data
  const getProjectFactors = (projectId: string) => {
    return [
      { positive: "No Competitor", risk: "Not Doing Demo" },
      { positive: "Customer Requirement Fulfillment", risk: "-" },
      { positive: "High Value Project", risk: "-" },
    ];
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    const timeout = setTimeout(() => {
      const foundAE = allAEData.find((ae) => ae.nik === nik);

      if (foundAE) {
        setAeData(foundAE);
      } else {
        setError("Data AE tidak ditemukan");
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [nik, allAEData]);

  const columns: TableColumn[] = useMemo(
    () => [
      { label: "Id Project", key: "idProject", sortable: true },
      { label: "Project Name", key: "projectName", sortable: true },
      { label: "Customer", key: "customer", sortable: true },
      { label: "Value Project", key: "valueProject", sortable: true },
      { label: "Stage", key: "stage", sortable: true },
      { label: "Jumlah Aktivitas", key: "jumlahAktivitas", sortable: true },
      { label: "Status", key: "status", sortable: true },
      { label: "Win Probability", key: "winProbability", sortable: true },
    ],
    []
  );

  const handleBack = () => {
    router.push("/journey/pelaksanaan");
  };

  const handleProjectDetail = (row: Record<string, any>) => {
    // Open popup with project details
    const probability = parseInt(row.winProbability.replace("%", ""));
    const factors = getProjectFactors(row.idProject);
    
    setSelectedProject({
      id: row.idProject,
      probability,
      factors,
    });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#CBD5E1] border-r-blue-500" />
        <span className="ml-3 text-[#02214C] font-inter font-semibold text-base">Loading...</span>
      </div>
    );
  }

  if (error || !aeData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-6">
        <div className="text-[#EF4444] font-inter font-semibold text-lg">
          {error || "Data tidak ditemukan"}
        </div>
        <Button variant="primary" onClick={handleBack}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1357px] mx-auto px-6 sm:px-10 py-6 sm:py-8">
        <div className="flex flex-col gap-8 sm:gap-10">
          {/* Back Button and Title Section */}
          <div className="flex flex-col gap-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleBack}
              className="w-fit"
            >
              <ArrowLeftIcon className="mr-2" size={20} />
              Back
            </Button>

            <div className="flex flex-col gap-3">
              <h1 className="text-[#0F172A] text-3xl sm:text-4xl lg:text-5xl font-inter font-bold leading-tight">
                {aeData.nik} - {aeData.nama}
              </h1>
              <p className="text-[#64748B] text-base sm:text-lg font-inter font-normal leading-relaxed">
                List of Projects
              </p>
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full">
            <Table
              columns={columns}
              data={aeData.projects}
              loading={false}
              error=""
              pageSize={4}
              onDetail={handleProjectDetail}
              showAction={true}
              actionColumnLabel="Action"
            />
          </div>
        </div>
      </div>

      {/* Win Probability Popup */}
      {selectedProject && (
        <WinProbabilityPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          projectId={selectedProject.id}
          winProbability={selectedProject.probability}
          factors={selectedProject.factors}
          modelName="XGBoost"
          modelAccuracy={85}
        />
      )}
    </div>
  );
}