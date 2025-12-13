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

// -----------------------------
// FORMATTERS
// -----------------------------
const formatPercent = (v: number | null | undefined) => {
  if (v === null || v === undefined) return "-";
  return `${(v * 100).toFixed(2)}`;
};

const formatCurrency = (v: number | null | undefined) => {
  if (v === null || v === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
};

const formatInt = (v: number | null | undefined) => {
  if (v === null || v === undefined) return "-";
  return Math.round(v); 
};

// -----------------------------
// TYPE
// -----------------------------
type Row = {
  nik: string;
  name: string;
  accountProfileDuty?: number;
  accountPlanDuty?: number;
  customerRequirement?: number;
  identifikasiPotensiProyek?: number;
  prebidPreparation?: number;
  riskProjectAssessment?: number;
  prosesDelivery?: number;
  invoicePelanggan?: number;
  customerKeyPerson?: number;
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function OnDutyOverviewPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [year, setYear] = useState<number>(2025);

  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fiModel, setFiModel] = useState<ModelInfo | null>(null);
  const [fiFeatures, setFiFeatures] = useState<Feature[]>([]);

  const quarterStr = `${quarter} ${year}`;

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // -----------------------------
  // FETCH DATA PELAKSANAAN
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const q = encodeURIComponent(quarterStr);
        const res = await fetch(`${API}/pelaksanaan/${q}`);

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();

        const mapped: Row[] = json.map((item: any) => ({
          nik: String(item.nik),
          name: item.name,

          // Percent columns
          accountProfileDuty: item.account_profile_duty,
          customerRequirement: item.customer_requirement,
          customerKeyPerson: item.customer_key_person,

          // Integer columns
          accountPlanDuty: item.account_plan_duty,
          identifikasiPotensiProyek: item.identifikasi_potensi_proyek,
          prebidPreparation: item.prebid_preparation,
          riskProjectAssessment: item.risk_project_assessment,
          prosesDelivery: item.proses_delivery,

          // Currency
          invoicePelanggan: item.invoice_pelanggan,
        }));

        let filtered = mapped;

        if (search) {
          const s = search.toLowerCase();
          filtered = mapped.filter(
            (x) =>
              x.name.toLowerCase().includes(s) || x.nik.includes(search)
          );
        }

        setData(filtered);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, quarter, year]);

  // -----------------------------
  // FETCH FEATURE IMPORTANCE
  // -----------------------------
  useEffect(() => {
    const fetchFI = async () => {
      try {
        const q = encodeURIComponent(quarterStr);
        let res = await fetch(
          `${API}/fi/orientasi_to_pelaksanaan`
        );

        let json = await res.json();

        const model: ModelInfo = {
          name: json.meta.best_regressor ?? "Model",
          R2: json.meta.metrics_overall.R2 ?? 0,
          trainCount: 2000
        };

        const featureList: Feature[] = json.features.map((f: any) => ({
          name: f.feature,
          importance: f.importance,
          description: f.description,
        }));

        setFiModel(model);
        setFiFeatures(featureList);
      } catch (err) {
        console.log("FI ERROR:", err);
      }
    };

    fetchFI();
  }, [quarter, year]);

  // -----------------------------
  // TABLE COLUMNS
  // -----------------------------
  const customerUnderstandingColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    {
      label: "Account Profile Duty (%)",
      key: "accountProfileDuty",
      sortable: true,
      render: (v) => formatPercent(v),
    },
    {
      label: "Account Plan Duty",
      key: "accountPlanDuty",
      sortable: true,
      render: (v) => formatInt(v),
    },
  ];

  const leadOpportunityColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    {
      label: "Customer Requirement (%)",
      key: "customerRequirement",
      sortable: true,
      render: (v) => formatPercent(v),
    },
    {
      label: "Identifikasi Potensi Proyek",
      key: "identifikasiPotensiProyek",
      sortable: true,
      render: (v) => formatInt(v),
    },
  ];

  const solutionManagementColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    { label: "Prebid Preparation", key: "prebidPreparation", sortable: true, render: (v) => formatInt(v), },
    {
      label: "Risk Project Assessment",
      key: "riskProjectAssessment",
      sortable: true,
      render: (v) => formatInt(v),
    },
  ];

  const contractDeliveryColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    { label: "Proses Delivery", key: "prosesDelivery", sortable: true, render: (v) => formatInt(v) },
  ];

  const billingAssuranceColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    {
      label: "Invoice Pelanggan",
      key: "invoicePelanggan",
      sortable: true,
      render: (v) => formatCurrency(v),
    },
  ];

  const relationshipManagementColumns: TableColumn[] = [
    { label: "NIK", key: "nik", sortable: true },
    { label: "Name", key: "name", sortable: true },
    {
      label: "Customer Key Person (%)",
      key: "customerKeyPerson",
      sortable: true,
      render: (v) => formatPercent(v),
    },
  ];

  const handleDetail = (row: Record<string, any>) => {
    const nik = row?.nik;
    if (nik) {
      const q = `${quarter} ${year}`;
      router.push(`/journey/pelaksanaan/${nik}?quarter=${encodeURIComponent(q)}`);
    }
  };

  const handleStageChange = (stage: string) => {
    const paths: any = {
      Orientasi: "/journey/orientasi",
      Pelaksanaan: "/journey/pelaksanaan",
      Kinerja: "/journey/kinerja",
      Evaluasi: "/journey/evaluasi",
      Pengembangan: "/journey/pengembangan",
    };
    router.push(paths[stage] ?? "/journey/pelaksanaan");
  };

  return (
    <div className="w-full">
      {/* Search + Filters */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] bg-white rounded-[20px] border border-[#CBD5E1] flex flex-row items-center gap-4 px-5 py-[30px]">
          <div className="flex-1 flex flex-col">
            <div className="text-[20px] font-semibold">Search Account Executive</div>
            <SearchBar value={search} onChange={setSearch} className="w-full" />
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-[200px]">
              <div className="text-[20px] font-semibold">Tahun</div>
              <FilterYear value={year} onChange={setYear} />
            </div>
            <div className="w-[200px]">
              <div className="text-[20px] font-semibold">Periode</div>
              <FilterQuarter value={quarter} onChange={(q) => setQuarter(q as any)} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex justify-center my-4">
        <div className="max-w-[1100px] w-full flex justify-center">
          <TabStage onStageChange={handleStageChange} />
        </div>
      </div>

      {/* --- TABLE GROUPS --- */}
      <Section title="Customer Understanding" description="Understanding customer profile and readiness">
        <Table
          columns={customerUnderstandingColumns}
          data={data}
          loading={loading}
          error={error}
          pageSize={5}
          onDetail={handleDetail}
          showAction
          actionColumnLabel="List of Projects"
        />
      </Section>

      <Section title="Lead & Opportunity" description="Opportunity identification and qualification">
        <Table
          columns={leadOpportunityColumns}
          data={data}
          loading={loading}
          error={error}
          pageSize={5}
          onDetail={handleDetail}
          showAction
          actionColumnLabel="List of Projects"
        />
      </Section>

      <Section title="Solution Management" description="Solution design and feasibility">
        <Table
          columns={solutionManagementColumns}
          data={data}
          loading={loading}
          error={error}
          pageSize={5}
          onDetail={handleDetail}
          showAction
          actionColumnLabel="List of Projects"
        />
      </Section>

      <Section title="Contract & Delivery" description="Execution and delivery quality">
        <Table
          columns={contractDeliveryColumns}
          data={data}
          loading={loading}
          error={error}
          pageSize={5}
          onDetail={handleDetail}
          showAction
          actionColumnLabel="List of Projects"
        />
      </Section>

      <Section title="Billing & Assurance Management" description="Customer billing & assurance">
        <Table
          columns={billingAssuranceColumns}
          data={data}
          loading={loading}
          error={error}
          pageSize={5}
          onDetail={handleDetail}
          showAction
          actionColumnLabel="List of Projects"
        />
      </Section>

      <Section title="Relationship Management" description="Customer relationship evaluation">
        <Table
          columns={relationshipManagementColumns}
          data={data}
          loading={loading}
          error={error}
          pageSize={5}
          onDetail={handleDetail}
          showAction
          actionColumnLabel="List of Projects"
        />
      </Section>

      {/* FEATURE IMPORTANCE */}
      <div className="w-full flex justify-center mt-10 mb-20">
        <div className="max-w-[1100px] w-full">
          <div className="text-[24px] font-bold mb-3">Feature Importance</div>
          {fiModel && (
            <FeatureImportanceSection
              features={fiFeatures}
              model={fiModel}
              guidanceFeatureImportance="Feature importance menunjukkan seberapa besar pengaruh sebuah fitur terhadap prediksi model."
              guidanceFeature="Klik bar untuk melihat penjelasan fitur."
            />
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// SECTION WRAPPER COMPONENT
// -----------------------------
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="max-w-[1100px] w-full">
        <Card heading={title} description={description}>
          <div className="-mx-4 sm:-mx-6 md:-mx-8 mt-4">
            <div className="px-2 sm:px-4 md:px-6">{children}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
