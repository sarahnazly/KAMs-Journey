import {
  EvaluationPredictionApiResponse,
} from "@/interfaces/evaluasi/apiTypes";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ae-journey.onrender.com";

// Fetch prediction for a specific AE (NIK)
export async function fetchPredictionForNik(
  nik: number,
  quarter: string,
  year:  number
): Promise<EvaluationPredictionApiResponse> {
  const res = await fetch(
    `${API}/ep/${nik}/predictions?quarter=${quarter}&year=${year}`,
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