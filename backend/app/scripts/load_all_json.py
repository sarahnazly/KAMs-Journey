import os
import json
from app.core.db import SessionLocal
from app.models.fi import FeatureImportanceMeta, FeatureImportance
from app.models.wp import WinProbMeta, WinProbPrediction
from app.models.orientasi import Orientasi
from app.models.pelaksanaan import Pelaksanaan
from app.models.kinerja import Kinerja
from app.models.evaluasi_kinerja import EvaluasiKinerja
from app.models.pengembangan import Pengembangan
from app.models.project import Project

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # app/
BASE_PATH = os.path.join(BASE_DIR, "data")

# ============================================================
# 1. LOAD FEATURE IMPORTANCE JSON
# ============================================================

def load_fi_results(db):
    fi_path = os.path.join(BASE_PATH, "fi_results_v17_normalized.json")
    print(f"📌 Loading Feature Importance from {fi_path}")

    with open(fi_path, "r") as f:
        fi_json = json.load(f)

    for phase_key, phase_data in fi_json.items():

        meta = FeatureImportanceMeta(
            phase=phase_key,
            phase_config=phase_data.get("phase_config"),
            best_regressor=phase_data.get("best_regressor"),
            metrics_overall=phase_data.get("metrics_overall"),
            metrics_by_quarter=phase_data.get("metrics_by_quarter")
        )

        db.add(meta)
        db.flush()  # get meta.id

        # Overall features
        for feat in phase_data.get("features_overall", []):
            db.add(FeatureImportance(
                phase=phase_key,
                quarter="ALL",
                feature=feat["feature"],
                importance=feat["importance"],
                description=feat.get("description", ""),
                meta_id=meta.id
            ))

        # Per quarter features
        for q, feat_list in phase_data.get("features_by_quarter", {}).items():
            for feat in feat_list:
                db.add(FeatureImportance(
                    phase=phase_key,
                    quarter=q,
                    feature=feat["feature"],
                    importance=feat["importance"],
                    description=feat.get("description", ""),
                    meta_id=meta.id
                ))

    print("✓ Feature Importance loaded.")


# ============================================================
# 2. LOAD RAW HRIS SHEET DATA (orientasi → pengembangan)
# ============================================================

def filter_valid_fields(data: dict, model_cls):
    """Remove keys that do not exist as model columns."""
    valid_columns = set(model_cls.__table__.columns.keys())
    return {k: v for k, v in data.items() if k in valid_columns}

def load_raw_sheets(db):
    print(f"📌 Loading Raw Sheets from {BASE_PATH}")
    with open(os.path.join(BASE_PATH, "input_data_all_quarters.json"), "r") as f:
        data = json.load(f)

    for qdata in data["quarters"]:
        quarter = qdata["quarter"]
        sheets = qdata["sheets"]

        # ---------- ORIENTASI ----------
        for item in sheets.get("orientasi", []):
            filtered = filter_valid_fields(item, Orientasi)
            db.add(Orientasi(
                quarter=quarter,
                sheet="orientasi",
                **filtered
            ))

        # ---------- PELAKSANAAN ----------
        for item in sheets.get("pelaksanaan", []):
            filtered = filter_valid_fields(item, Pelaksanaan)
            db.add(Pelaksanaan(
                quarter=quarter,
                sheet="pelaksanaan",
                **filtered
            ))

        # ---------- KINERJA ----------
        for item in sheets.get("kinerja", []):
            filtered = filter_valid_fields(item, Kinerja)
            db.add(Kinerja(
                quarter=quarter,
                sheet="kinerja",
                **filtered
            ))

        # ---------- EVALUASI ----------
        for item in sheets.get("evaluasi kinerja", []):
            filtered = filter_valid_fields(item, EvaluasiKinerja)
            db.add(EvaluasiKinerja(
                quarter=quarter,
                sheet="evaluasi kinerja",
                **filtered
            ))

        # ---------- PENGEMBANGAN ----------
        for item in sheets.get("pengembangan", []):
            filtered = filter_valid_fields(item, Pengembangan)
            db.add(Pengembangan(
                quarter=quarter,
                sheet="pengembangan",
                **filtered
            ))

        # ---------- PROJECT ----------
        for item in sheets.get("project", []):
            filtered = filter_valid_fields(item, Project)
            db.add(Project(
                quarter=quarter,
                sheet="project",
                **filtered
            ))

    db.commit()
    print("✓ Raw Sheet Input loaded.")

# ============================================================
# 3. LOAD WIN PROBABILITY (predictions & metadata)
# ============================================================

def load_winprob(db):
    wp_pred_path = os.path.join(BASE_PATH, "winprob_predictions_by_quarter.json")
    wp_meta_path = os.path.join(BASE_PATH, "winprob_model_meta.json")

    print(f"📌 Loading Win Probability predictions from {wp_pred_path}")
    print(f"📌 Loading Win Probability model metadata from {wp_meta_path}")

    # ------------------ LOAD PREDICTIONS ------------------
    with open(wp_pred_path, "r") as f:
        wp_json = json.load(f)

    for quarter, rows in wp_json.items():
        for row in rows:
            db.add(WinProbPrediction(
                quarter = quarter,

                # identity
                nik = row.get("nik"),
                name = row.get("name"),
                unit = row.get("unit"),

                # project info
                lop_id = row.get("lop_id"),
                project_name = row.get("project_name"),
                customer_name = row.get("customer_name"),
                stage = row.get("stage"),
                status = row.get("status"),

                # numeric values
                value_projects = row.get("value_projects"),
                jumlah_aktivitas = row.get("jumlah_aktivitas"),

                # predictions
                win_probability = row.get("win_probability"),
                win_probability_pct = row.get("win_probability_pct"),
                predicted_class = row.get("predicted_class"),
                top_positive_factors = row.get("top_positive_factors"),
                top_negative_factors = row.get("top_negative_factors"),

            ))

    # ------------------ LOAD META ------------------
    with open(wp_meta_path, "r") as f:
        meta = json.load(f)

    db.add(WinProbMeta(
        best_model_name = meta.get("best_model_name"),
        metrics = meta.get("metrics")
    ))

    db.commit()
    print("✓ Win Probability predictions loaded.")

# ============================================================
# MAIN EXECUTION
# ============================================================

if __name__ == "__main__":
    db = SessionLocal()

    try:
        load_fi_results(db)
        load_raw_sheets(db)
        load_winprob(db)

        db.commit()
        print("\n🎉 ALL JSON DATA SUCCESSFULLY LOADED INTO DATABASE!")

    except Exception as e:
        db.rollback()
        print("❌ ERROR:", e)

    finally:
        db.close()
