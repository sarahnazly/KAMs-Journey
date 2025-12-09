export interface EvaluasiActualApiResponse {
  id:  number;
  quarter: string;
  sheet:  string;
  nik: number;
  name: string;
  
  // Achievement values (0-1+ floats)
  revenue_sales_achievement: number;
  sales_achievement_datin:  number;
  sales_achievement_wifi: number;
  sales_achievement_hsi: number;
  sales_achievement_wireline:  number;
  profitability_achievement: number;
  collection_rate_achievement: number;
  nps_achievement: number;
  ae_tools_achievement: number;
  capability_achievement: number;
  behaviour_achievement: number;
  
  overall_score: number;
  kuadran: number;
  periode: string;
  unit: string;
}

export interface MetricsStructure {
  regression: {
    name:  string;
    mean_r2: number;
    per_target_metrics: {
      [kpiName: string]: {
        R2: number;
        MAE: number;
        MSE: number;
        RMSE: number;
      };
    };
  };
  classification:  {
    name: string;
    accuracy: number;
    f1_macro: number;
    precision_macro: number;
    recall_macro: number;
  };
}

export interface EvaluationPredictionApiResponse {
  meta: {
    quarter: string;
    year: number;
    generated_date: string;
    best_regressor: string;
    best_classifier: string;
    metrics: MetricsStructure;
  };
  data: Array<{
    nik: number;
    name: string;
    prediction_quarter: string;
    prediction_year: number;
    predicted_kuadran: number;
    prediction_confidence: number;
    predictions: {
      revenue_sales_achievement:  number;
      sales_achievement_datin: number;
      sales_achievement_wifi: number;
      sales_achievement_hsi:  number;
      sales_achievement_wireline: number;
      profitability_achievement: number;
      collection_rate_achievement: number;
      ae_tools_achievement: number;
      capability_achievement: number;
      behaviour_achievement: number;
      nps_achievement: number;
    };
  }>;
}