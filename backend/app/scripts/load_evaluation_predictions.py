import os
import json
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.models.ep import (
    EvaluationPrediction,
    EvaluationPredictionMeta
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # /app
DATA_DIR = os.path.join(BASE_DIR, "data")

META_FILE = "evaluation__meta__q4_2025.json"
PRED_FILE = "evaluation__predictions__q4_2025.json"


def load_evaluation_meta(db: Session, filename: str):
    path = os.path.join(DATA_DIR, filename)
    print(f"📌 Loading Evaluation Metadata: {path}")

    with open(path, "r") as f:
        meta_json = json.load(f)

    meta_row = EvaluationPredictionMeta(
        prediction_quarter=meta_json["prediction_quarter"],
        prediction_year=meta_json["prediction_year"],
        generated_date=meta_json["generated_date"],
        best_regressor=meta_json["models"]["regression"]["name"],
        best_classifier=meta_json["models"]["classification"]["name"],
        model_metrics=meta_json["models"]
    )

    db.add(meta_row)
    db.commit()
    return meta_row.id


def load_evaluation_predictions(db: Session, filename: str):
    path = os.path.join(DATA_DIR, filename)
    print(f"📌 Loading Evaluation Predictions: {path}")

    with open(path, "r") as f:
        rows = json.load(f)

    inserted = 0

    for row in rows:
        pred = EvaluationPrediction(
            nik=row.get("nik"),
            name=row.get("name"),

            prediction_quarter=row["prediction_quarter"],
            prediction_year=row["prediction_year"],

            predicted_kuadran=row["predicted_kuadran"],
            prediction_confidence=row["prediction_confidence"],
            predictions_json=row["predictions"],
            raw_json=row
        )
        db.add(pred)
        inserted += 1

    db.commit()
    print(f"✓ {inserted} predictions saved.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        meta_id = load_evaluation_meta(db, META_FILE)
        load_evaluation_predictions(db, PRED_FILE)

        print("\n🎉 Evaluation predictions loaded successfully!")
    except Exception as e:
        db.rollback()
        print("❌ Error:", e)
    finally:
        db.close()
