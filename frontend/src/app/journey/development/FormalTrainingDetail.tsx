"use client";

import React, { useEffect, useMemo, useState } from "react";
import PopUpWindow from "@/components/modal/PopUpWindow";

type SortKey = "no" | "certificate" | "result";
type SortDir = "asc" | "desc";

export type FormalDetailRow = {
  no: number;          
  certificate: string;
  result: string;      
};

export interface FormalTrainingDetailProps {
  isOpen: boolean;
  onClose: () => void;
  am: { nik: string; name: string } | null;
  // Opsional: loader jika mau fetch dari API
  fetchDetails?: (nik: string) => Promise<FormalDetailRow[]>;
}

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span className="ml-1">
      {direction === "asc" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 6L11 9H5L8 6Z" fill={active ? "#fff" : "#CBD5E1"} />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 10L5 7H11L8 10Z" fill={active ? "#fff" : "#CBD5E1"} />
        </svg>
      )}
    </span>
  );
}

// Mock loader fallback jika fetchDetails tidak diberikan
async function mockFetchDetails(nik: string): Promise<FormalDetailRow[]> {
  await new Promise((r) => setTimeout(r, 500));
  return [
    { no: 1, certificate: `CERT-${nik}-001`, result: "BERIMPACT" },
    { no: 2, certificate: `CERT-${nik}-002`, result: "BERIMPACT" },
    { no: 3, certificate: `CERT-${nik}-003`, result: "TIDAK BERIMPACT" },
  ];
}

const FormalTrainingDetail: React.FC<FormalTrainingDetailProps> = ({
  isOpen,
  onClose,
  am,
  fetchDetails,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [rows, setRows] = useState<FormalDetailRow[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("no");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Load data ketika popup dibuka atau NIK berubah
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isOpen || !am?.nik) return;
      setLoading(true);
      setError("");
      try {
        const loader = fetchDetails ?? mockFetchDetails;
        const data = await loader(am.nik);
        if (!mounted) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Gagal memuat detail formal training.");
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isOpen, am?.nik, fetchDetails]);

  // Sorting
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return key;
    });
  };

  return (
    <PopUpWindow
      title={`Detail Formal Training`}
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* Info AM */}
      {am && (
        <div className="mb-4 text-sm text-[#64748B]">
          <span className="text-[#0F172A] font-semibold text-[18px] leading-[26px]">{am.nik} — {am.name}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="w-full min-h-[160px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#CBD5E1] border-r-blue-500" />
          <span className="ml-3 text-[#164E9D] font-inter font-semibold">Loading...</span>
        </div>
      )}

      {/* Error / Empty */}
      {!loading && (error || sortedRows.length === 0) && (
        <div className="w-full min-h-[140px] flex items-center justify-center">
          <div className="text-[#64748B]">
            {error || "Data tidak tersedia untuk AM ini."}
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && sortedRows.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full table-auto font-inter">
            <thead>
              <tr>
                {([
                  { label: "Nomor", key: "no" as SortKey },
                  { label: "Sertifikat", key: "certificate" as SortKey },
                  { label: "Hasil Formal Training", key: "result" as SortKey },
                ] as const).map((col, idx, arr) => (
                  <th
                    key={col.key}
                    className="py-4 px-3 text-center text-[15px] font-bold text-white bg-[#02214C] select-none"
                    style={{
                      fontFamily: "Inter, Arial, Helvetica, sans-serif",
                      lineHeight: "19.2px",
                      fontWeight: 700,
                      borderTopLeftRadius: idx === 0 ? 5 : 0,
                      borderTopRightRadius: idx === arr.length - 1 ? 5 : 0,
                      cursor: "pointer",
                    }}
                    onClick={() => toggleSort(col.key)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{col.label}</span>
                      <SortIcon active={sortKey === col.key} direction={sortKey === col.key ? sortDir : "asc"} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r, idx) => (
                <tr key={`${r.no}-${r.certificate}`} className={`${idx % 2 === 1 ? "bg-[#f1f5f9]" : "bg-white"}`}>
                  <td className="px-3 py-4 text-[15px] text-[#363B3F] text-center font-medium">{r.no}</td>
                  <td className="px-3 py-4 text-[15px] text-[#363B3F] text-center font-medium">{r.certificate}</td>
                  <td className="px-3 py-4 text-[15px] text-[#363B3F] text-center font-medium">{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PopUpWindow>
  );
};

export default FormalTrainingDetail;