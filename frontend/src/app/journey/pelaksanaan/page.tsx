"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import FilterQuarter from "@/components/dashboard/FilterQuarter";
import FilterYear from "@/components/dashboard/FilterYear";
import TabStage from "@/components/dashboard/TabStage";
import Table, { TableColumn } from "@/components/dashboard/Table";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import FeatureImportanceSection, {
  Feature,
  ModelInfo,
} from "@/components/dashboard/FeatureImportance";

type Row = {
  nik: string;
  nama: string;
  accountProfile?: number;
  accountPlan?: number;
  customerRequirement?: number;
  potensiProyek?: number;
  demoPOC?: number;
  desainProposal?: number;
  prebidPreparation?: number;
  riskAssessment?: number;
  prosesDelivery?: number;
  invoicePelanggan?: number;
  komplainPelanggan?: number;
  informasiPIC?: number;
  jumlahPIC?: number;
  actionToGrow?: number;
  jumlahAktivitas?: number;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
};

export default function OnDutyOverviewPage() {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [year, setYear] = useState<number>(2025);

  // Table state
  const [data, setData] = useState<Row[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Dummy data simulate API
  const allData: Row[] = useMemo(
    () => [
      { 
        nik: "20919", 
        nama: "Ratu Nadya Anjania", 
        accountProfile: 90, 
        accountPlan: 88,
        customerRequirement: 93,
        potensiProyek: 85,
        demoPOC: 90,
        desainProposal: 88,
        prebidPreparation: 90,
        riskAssessment: 88,
        prosesDelivery: 86,
        invoicePelanggan: 88,
        komplainPelanggan: 90,
        informasiPIC: 88,
        jumlahPIC: 92,
        actionToGrow: 90,
        jumlahAktivitas: 88,
        quarter: "Q1", 
        year: 2025 
      },
      { 
        nik: "20920", 
        nama: "Budi Santoso", 
        accountProfile: 85, 
        accountPlan: 83,
        customerRequirement: 88,
        potensiProyek: 80,
        demoPOC: 85,
        desainProposal: 83,
        prebidPreparation: 85,
        riskAssessment: 83,
        prosesDelivery: 81,
        invoicePelanggan: 83,
        komplainPelanggan: 85,
        informasiPIC: 83,
        jumlahPIC: 87,
        actionToGrow: 85,
        jumlahAktivitas: 83,
        quarter: "Q1", 
        year: 2025 
      },
      { 
        nik: "20921", 
        nama: "Nicholas Saputra", 
        accountProfile: 92, 
        accountPlan: 90,
        customerRequirement: 95,
        potensiProyek: 87,
        demoPOC: 92,
        desainProposal: 90,
        prebidPreparation: 92,
        riskAssessment: 90,
        prosesDelivery: 90,
        invoicePelanggan: 90,
        komplainPelanggan: 92,
        informasiPIC: 90,
        jumlahPIC: 94,
        actionToGrow: 92,
        jumlahAktivitas: 90,
        quarter: "Q1", 
        year: 2025 
      },
      { 
        nik: "20922", 
        nama: "Pinky Siwi", 
        accountProfile: 88, 
        accountPlan: 86,
        customerRequirement: 91,
        potensiProyek: 83,
        demoPOC: 88,
        desainProposal: 86,
        prebidPreparation: 88,
        riskAssessment: 86,
        prosesDelivery: 85,
        invoicePelanggan: 86,
        komplainPelanggan: 88,
        informasiPIC: 86,
        jumlahPIC: 90,
        actionToGrow: 88,
        jumlahAktivitas: 86,
        quarter: "Q1", 
        year: 2025 
      },
      // Other quarters
      { 
        nik: "20920", 
        nama: "Budi Santoso", 
        accountProfile: 85, 
        accountPlan: 83,
        quarter: "Q2", 
        year: 2025 
      },
      { 
        nik: "20921", 
        nama: "Nicholas Saputra", 
        accountProfile: 92, 
        accountPlan: 90,
        quarter: "Q3", 
        year: 2025 
      },
      { 
        nik: "20922", 
        nama: "Pinky Siwi", 
        accountProfile: 88, 
        accountPlan: 86,
        quarter: "Q4", 
        year: 2025 
      },
      { 
        nik: "20923", 
        nama: "Anindya Maulida", 
        accountProfile: 90, 
        accountPlan: 88,
        quarter: "Q1", 
        year: 2024 
      },
    ],
    []
  );

  // Map stage TabStage -> route
  const stageToPath = (stage: string) => {
    switch (stage) {
      case "Orientasi":
        return "/journey/orientasi";
      case "Pelaksanaan":
        return "/journey/pelaksanaan";
      case "Kinerja":
        return "/journey/kinerja";
      case "Evaluasi":
        return "/journey/evaluasi";
      case "Pengembangan":
        return "/journey/pengembangan";
      default:
        return "/journey/orientasi";
    }
  };

  // Dedupe helper
  const dedupeByNik = (rows: Row[]) => {
    const seen = new Set<string>();
    const unique: Row[] = [];
    for (const r of rows) {
      if (!seen.has(r.nik)) {
        seen.add(r.nik);
        unique.push(r);
      }
    }
    return unique;
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    const t = setTimeout(() => {
      let filtered = allData.filter((row) => row.quarter === quarter && row.year === year);
      filtered = dedupeByNik(filtered);

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((row) => row.nama.toLowerCase().includes(q) || row.nik.includes(search));
      }

      setData(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [allData, quarter, year, search]);

  // Detail button
  const handleDetail = (row: Record<string, any>) => {
    const nik = row?.nik;
    if (nik) router.push(`/journey/pelaksanaan/${nik}`);
  };

  // TabStage navigation
  const handleStageChange = (stage: string) => {
    const path = stageToPath(stage);
    router.push(path);
  };

  // Column definitions for each category
  const customerUnderstandingColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Account Profile", key: "accountProfile", sortable: true },
    { label: "Account Plan", key: "accountPlan", sortable: true },
  ];

  const leadOpportunityColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Customer Requirement", key: "customerRequirement", sortable: true },
    { label: "Potensi Proyek", key: "potensiProyek", sortable: true },
    { label: "Demo POC", key: "demoPOC", sortable: true },
  ];

  const solutionManagementColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Desain Proposal", key: "desainProposal", sortable: true },
    { label: "Prebid Preparation", key: "prebidPreparation", sortable: true },
    { label: "Risk Assessment", key: "riskAssessment", sortable: true },
  ];

  const contractDeliveryColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Proses Delivery", key: "prosesDelivery", sortable: true },
  ];

  const billingAssuranceColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Invoice Pelanggan", key: "invoicePelanggan", sortable: true },
    { label: "Komplain Pelanggan", key: "komplainPelanggan", sortable: true },
  ];

  const relationshipManagementColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Nama", key: "nama", sortable: true },
    { label: "Informasi PIC", key: "informasiPIC", sortable: true },
    { label: "Jumlah PIC", key: "jumlahPIC", sortable: true },
    { label: "Action to Grow", key: "actionToGrow", sortable: true },
    { label: "Jumlah Aktivitas", key: "jumlahAktivitas", sortable: true },
  ];

// Feature Importance data
const features: Feature[] = useMemo(
    () => [
    { name: "visiting_customer", importance: 0.20, description: "Tingkat kepahaman terhadap konsep kunjungan langsung ke pelanggan, yang bertujuan untuk membangun hubungan lebih dekat dan memahami kebutuhan pelanggan secara mendalam." },
    { name: "account_profile", importance: 0.16, description: "Tingkat kepahaman dalam menyusun profil komprehensif dari pelanggan." },
    { name: "sales_funnel", importance: 0.14, description: "Tingkat kepahaman terhadap efektivitas proses pergerakan prospek dalam tahapan penjualan." },
    { name: "account_plan", importance: 0.12, description: "Tingkat kepahaman mengenai kualitas, penyusunan, dan pelaksanaan account plan." },
    { name: "bidding_management", importance: 0.10, description: "Tingkat kepahaman dalam mengelola proses penawaran kepada pelanggan secara efisien." },
    { name: "customer_matching", importance: 0.08, description: "Tingkat kepahaman dalam mencocokkan kebutuhan pelanggan dengan solusi yang tepat." },
    { name: "customer_introduction", importance: 0.07, description: "Tingkat kepahaman dalam memperkenalkan produk atau layanan kepada pelanggan secara efektif." },
    { name: "solusi", importance: 0.05, description: "Tingkat kepahaman terhadap penyusunan solusi yang sesuai untuk pelanggan." },
    { name: "transfer_customer_knowledge", importance: 0.04, description: "Tingkat kepahaman terkait transfer pengetahuan pelanggan." },
    { name: "project_management", importance: 0.025, description: "Tingkat kepahaman dalam mengelola proyek." },
    { name: "transfer_customer_documentation", importance: 0.015, description: "Tingkat kepahaman terkait transfer dokumentasi pelanggan." },
    { name: "saran_pengembangan", importance: 0.010, description: "Tingkat kepahaman dalam pemberian saran pengembangan." },
    ],
    []
);

const model: ModelInfo = useMemo(
    () => ({ name: "XGBoost", accuracy: 0.85, trainCount: 500 }),
    []
);

  return (
    <div className="w-full">
      {/* Search + Filters card */}
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]"
          style={{ outlineOffset: -1 }}
        >
          <div className="flex-1 flex flex-col items-start">
            <div className="w-full text-black text-[20px] font-semibold leading-[30px]">Search Account Executive</div>
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
                <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as any)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TabStage align center */}
      <div className="w-full flex items-center justify-center mb-4 mt-4">
        <div className="max-w-[1100px] w-full flex items-center justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Multiple Tables - Customer Understanding */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card heading="Customer Understanding" description="Understanding customer profile and needs">
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={customerUnderstandingColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                  actionColumnLabel="List of Projects"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Lead & Opportunity */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card heading="Lead & Opportunity" description="Identification and development of opportunities">
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={leadOpportunityColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                  actionColumnLabel="List of Projects"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Solution Management */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card heading="Solution Management" description="Design and solution management">
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={solutionManagementColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                  actionColumnLabel="List of Projects"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Contract & Delivery */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card heading="Contract & Delivery" description="Contract execution and delivery">
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={contractDeliveryColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                  actionColumnLabel="List of Projects"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Billing & Assurance Management */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="max-w-[1100px] w-full">
          <Card heading="Billing & Assurance Management" description="Customer billing and assurance management">
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={billingAssuranceColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                  actionColumnLabel="List of Projects"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Relationship Management */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
          <Card heading="Relationship Management" description="Customer relationship management">
            <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
              <div className="px-2 sm:px-4 md:px-6">
                <Table
                  columns={relationshipManagementColumns}
                  data={data}
                  loading={loading}
                  error={error}
                  pageSize={4}
                  onDetail={handleDetail}
                  showAction={true}
                  actionColumnLabel="List of Projects"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="w-full flex items-center justify-center mb-10">
        <div className="max-w-[1100px] w-full">
            <div className="text-[#0F172A] text-[22px] md:text-[24px] font-bold mb-3">Feature Importance</div>
                <FeatureImportanceSection
                    features={features}
                    model={model}
                    guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model."
                    guidanceFeature="Klik bar untuk melihat penjelasan fitur."
                />
            </div>
        </div>
    </div>
  );
}