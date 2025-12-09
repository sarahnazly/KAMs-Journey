import { EvaluasiActualApiResponse } from "@/interfaces/evaluasi/apiTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch actual evaluation data for a specific employee (NIK)
export async function fetchEvaluasiByNik(
  nik: number,
  quarter: string
): Promise<EvaluasiActualApiResponse> {
  const res = await fetch(
    `${BASE_URL}/evaluasi/ae/${nik}?quarter=${encodeURIComponent(quarter)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`No data found for NIK ${nik} in ${quarter}`);
    }
    throw new Error(
      `Failed to fetch evaluasi data for NIK ${nik}: ${res.statusText}`
    );
  }

  return res.json();
}