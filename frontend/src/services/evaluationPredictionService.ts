import {
  EvaluationPredictionApiResponse,
} from "@/interfaces/evaluasi/apiTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch prediction for a specific AE (NIK)
export async function fetchPredictionForNik(
  nik: number,
  quarter: string,
  year:  number
): Promise<EvaluationPredictionApiResponse> {
  const res = await fetch(
    `${BASE_URL}/ep/${nik}/predictions?quarter=${quarter}&year=${year}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        `No prediction found for NIK ${nik} in ${quarter} ${year}`
      );
    }
    throw new Error(
      `Failed to fetch prediction for NIK ${nik}:  ${res.statusText}`
    );
  }

  return res.json();
}