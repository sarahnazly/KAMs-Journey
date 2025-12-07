from app.models.fi import FIMeta, FIFeature
from app.utils.json_loader import load_json_file

def load_fi_into_db(db, json_filename="fi_results_v17_normalized.json"):
    data = load_json_file(json_filename)
    inserted = 0

    for phase_key, content in data.items():

        # ------- META -------
        meta = FIMeta(
            phase=phase_key,
            phase_config=content.get("phase_config"),
            best_regressor=content.get("best_regressor"),
            metrics_overall=content.get("metrics_overall"),
            metrics_by_quarter=content.get("metrics_by_quarter"),
            raw=content
        )
        db.add(meta)

        # ------- FEATURE OVERALL -------
        for idx, f in enumerate(content.get("features_overall", []), start=1):
            db.add(FIFeature(
                phase=phase_key,
                quarter="GLOBAL",
                feature_name=f["feature"],
                importance=f["importance"],
                description=f.get("description"),
                importance_type="overall",
                rank=idx,
                raw=f
            ))
            inserted += 1

        # ------- FEATURE BY QUARTER -------
        for q, feats in content.get("features_by_quarter", {}).items():
            for idx, f in enumerate(feats, start=1):
                db.add(FIFeature(
                    phase=phase_key,
                    quarter=q,
                    feature_name=f["feature"],
                    importance=f["importance"],
                    description=f.get("description"),
                    importance_type="quarter",
                    rank=idx,
                    raw=f
                ))
                inserted += 1

    db.commit()
    return inserted
