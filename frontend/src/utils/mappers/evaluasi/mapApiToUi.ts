import {
  EvaluasiActualApiResponse,
  EvaluationPredictionApiResponse,
} from "@/interfaces/evaluasi/apiTypes";
import {
  EmployeeEvaluationRow,
  EmployeeEvaluationDetail,
  KPIData,
  QuadrantData,
  MLModelMetadata,
  KPIKey,
} from "@/interfaces/evaluasi/types";
import { normalizeToPercentage } from "./valueNormalizers";
import {
  calcDelta,
  calcDeltaPercent,
  calcQuadrantStatus,
} from "./statusCalculators";
import { getCategoryForKPI, getKPIName } from "./kpiCategories";

// Helper: Map backend field name to KPIKey
const BACKEND_TO_KPI_KEY:  Record<string, KPIKey> = {
  revenue_sales_achievement: "revenueSales",
  sales_achievement_datin: "salesDatin",
  sales_achievement_wifi: "salesWifi",
  sales_achievement_hsi: "salesHSI",
  sales_achievement_wireline: "salesWireline",
  profitability_achievement:  "profitability",
  collection_rate_achievement: "collectionRate",
  ae_tools_achievement: "aeTools",
  capability_achievement: "capability",
  behaviour_achievement: "behaviour",
  nps_achievement: "nps",
};

export function mapToAEDetail(
  actual: EvaluasiActualApiResponse,
  prediction: EvaluationPredictionApiResponse
): EmployeeEvaluationDetail {
  const predData = prediction.data[0];

  if (!predData) {
    throw new Error("Prediction data is empty");
  }
  // Map KPI data
  const kpis: KPIData[] = Object.entries(BACKEND_TO_KPI_KEY).map(
    ([backendField, kpiKey]) => {
      // Get category metadata
      const categoryInfo = getCategoryForKPI(kpiKey);
      const category = categoryInfo?.category || "Other";
      const subcategory = categoryInfo?.subcategory || "General";

      // Get proper KPI display name
      const displayName = getKPIName(kpiKey);

      // Get current value from actual data
      const currentRaw = (actual as any)[backendField];
      const current = normalizeToPercentage(currentRaw);

      // Get predicted value from prediction data
      const predictedRaw = predData.predictions[
        backendField as keyof typeof predData.predictions
      ];
      const predicted = normalizeToPercentage(predictedRaw);

      // Calculate delta
      const delta = calcDelta(current, predicted);
      const deltaPercent = calcDeltaPercent(current, predicted);

      return {
        key: kpiKey,
        name: displayName,
        current,
        predicted,
        delta,
        deltaPercent,
        category,
        subcategory,
      };
    }
  );

  // Map quadrant data
  const quadrant:   QuadrantData = {
    current: actual.kuadran,
    predicted: predData.predicted_kuadran,
    status: calcQuadrantStatus(actual.kuadran, predData.predicted_kuadran),
  };

  return {
    nik: actual.nik,
    name: actual.name,
    kpis,
    quadrant,
    currentQuarter: actual.quarter,
    predictedQuarter: `${predData.prediction_quarter} ${predData.prediction_year}`,
    predictionConfidence: predData.prediction_confidence,
  };
}

export function mapToMLMetadata(
  prediction: EvaluationPredictionApiResponse
): MLModelMetadata {
  const { meta } = prediction;

  return {
    regressorName: meta.best_regressor,
    classifierName: meta.best_classifier,
    meanR2: meta.metrics.regression.mean_r2,
    classificationAccuracy: meta.metrics.classification.accuracy,
    generatedDate: meta.generated_date,
  };
}