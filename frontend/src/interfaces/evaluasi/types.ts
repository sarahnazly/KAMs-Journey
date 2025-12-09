export type KPIKey =
  | "revenueSales"
  | "salesDatin"
  | "salesWifi"
  | "salesHSI"
  | "salesWireline"
  | "profitability"
  | "collectionRate"
  | "aeTools"
  | "capability"
  | "behaviour"
  | "nps";

export type KPIStatus =
  | "Exceeds"
  | "On Track"
  | "Near Target"
  | "Needs Focus"
  | "Critical";

export interface KPIData {
  key: KPIKey;
  name: string;

  // Values as percentages (0-100, can exceed or be negative)
  current: number;
  predicted: number | null;

  // Calculated fields
  delta: number | null;
  deltaPercent: string | null;

  // Grouping
  category: string;
  subcategory: string;
}

export type QuadrantStatus = "Improving" | "Stable" | "Declining";

export interface QuadrantData {
  current: number;
  predicted: number | null;
  status:  QuadrantStatus | null;
}

export interface EvaluasiRow {
  nik: string;
  name: string;
  revenueSalesAch: number;
  salesAchDatin: number;
  salesAchWifi: number;
  salesAchHSI: number;
  salesAchWireline: number;
  profitabilityAch: number;
  collectionRateAch: number;
  aeToolsAch: number;
  capabilityAch: number;
  behaviourAch: number;
  nps: number;
  evaluationQuadrant: number;
  quarter: string;
  year: number;
};

export interface EmployeeEvaluationRow {
  nik:  number;
  name: string;

  // Key metrics (percentages 0-100)
  revenueSalesAch: number;
  profitabilityAch:  number;
  aeToolsAch: number;
  nps: number;
  evaluationQuadrant: number;

  quarter: string;
  year:  number;
}

// For Predictions Detail Page
export interface EmployeeEvaluationDetail {
  nik: number;
  name: string;

  // All KPIs with predictions
  kpis: KPIData[];

  // Quadrant positioning
  quadrant: QuadrantData;

  // Metadata
  currentQuarter: string;     // "Q3 2025"
  predictedQuarter: string;   // "Q4 2025"
  predictionConfidence: number;
}

// ML Model Metadata
export interface MLModelMetadata {
  regressorName: string;
  classifierName: string;
  meanR2: number;
  classificationAccuracy: number;
  generatedDate: string;
  trainingDataCount?: number;
  testDataCount?: number;
}


// Prediction Period
export interface PredictionPeriod {
  quarter: string;
  year: number;
  generatedDate: string;
  label: string; // "Q4 2025"
}