from sqlalchemy.orm import Session
from app.models.wp import WinProbMeta, WinProbPrediction
from app.utils.json_handler import load_json

def load_wp_meta_and_store(db: Session):
    meta = load_json("winprob_model_meta.json")

    db_obj = WinProbMeta(
        best_model_name=meta["best_model_name"],
        metrics_json=meta["metrics"],
        class_labels=meta["class_labels"],
        n_rows_total=meta["n_rows_total"],
        quarters=meta["quarters"]
    )

    db.add(db_obj)
    db.commit()
    return {"status": "meta_saved"}


def load_wp_predictions_and_store(db: Session):
    predictions = load_json("winprob_predictions_by_quarter.json")

    for quarter, records in predictions.items():
        for item in records:
            db_obj = WinProbPrediction(
                nik=item["nik"],
                name=item["name"],
                lop_id=item["lop_id"],
                quarter=quarter,
                win_probability=item["win_probability"],
                win_probability_pct=item["win_probability_pct"],
                predicted_class=item["predicted_class"],
                top_positive_factors=item["top_positive_factors"],
                top_negative_factors=item["top_negative_factors"],
                raw_json=item,
            )
            db.add(db_obj)

    db.commit()
    return {"status": "predictions_saved"}


def get_predictions_by_quarter(db: Session, quarter: str):
    return db.query(WinProbPrediction).filter(
        WinProbPrediction.quarter == quarter
    ).all()

def get_best_model_metrics(db: Session):
    meta = db.query(WinProbMeta).order_by(WinProbMeta.id.desc()).first()
    if not meta:
        return None

    best = meta.best_model_name
    all_metrics = meta.metrics or {}

    best_metrics = all_metrics.get(best, {})

    return {
        "best_model": best,
        "metrics": best_metrics
    }