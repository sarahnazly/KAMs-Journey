from sqlalchemy.orm import Session
from app.models.ep import EvaluationPrediction, EvaluationPredictionMeta

# Helper: Build consistent API response structure
def build_ep_response(meta: EvaluationPredictionMeta, predictions):
    return {
        "meta": {
            "quarter": meta.prediction_quarter,
            "year": meta.prediction_year,
            "generated_date": meta.generated_date,
            "best_regressor": meta.best_regressor,
            "best_classifier": meta.best_classifier,
            "metrics": meta.model_metrics,
        },
        "data": [
            p.raw_json or {
                "nik": p.nik,
                "name": p.name,
                "predicted_kuadran": p.predicted_kuadran,
                "prediction_confidence": p.prediction_confidence,
                "predictions": p.predictions_json,
            }
            for p in predictions
        ],
    }


# Get metadata for the period
def get_meta_for_period(db: Session, quarter: str, year: int):
    return (
        db.query(EvaluationPredictionMeta)
        .filter(
            EvaluationPredictionMeta.prediction_quarter == quarter,
            EvaluationPredictionMeta.prediction_year == year,
        )
        .first()
    )


# Get prediction for a single AE
def get_prediction_for_nik(db: Session, nik: str, quarter: str, year: int):
    return (
        db.query(EvaluationPrediction)
        .filter(
            EvaluationPrediction.nik == nik,
            EvaluationPrediction.prediction_quarter == quarter,
            EvaluationPrediction.prediction_year == year,
        )
        .first()
    )


# High-level function for detail page (1 AE)
def get_prediction_detail(db: Session, nik: str, quarter: str, year: int):
    pred = get_prediction_for_nik(db, nik, quarter, year)
    meta = get_meta_for_period(db, quarter, year)

    if not pred or not meta:
        return None

    # Build response using the same helper so format is consistent
    return build_ep_response(meta, [pred])
