from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.fi import FeatureImportance, FeatureImportanceMeta

router = APIRouter(prefix="/fi", tags=["Feature Importance"])

# Get FI per phase
@router.get("/{phase}")
def get_feature_importance(phase: str, db: Session = Depends(get_db)):
    meta = db.query(FeatureImportanceMeta).filter(
        FeatureImportanceMeta.phase == phase
    ).first()

    if not meta:
        raise HTTPException(status_code=404, detail="Phase not found")

    features = db.query(FeatureImportance).filter(
        FeatureImportance.phase == phase,
        FeatureImportance.quarter == "ALL"
    ).all()

    return {
        "meta": meta.to_dict(),
        "features": [f.to_dict() for f in features]
    }

# Get FI per phase + quarter
@router.get("/{phase}/{quarter}")
def get_feature_importance_quarter(phase: str, quarter: str, db: Session = Depends(get_db)):
    meta = db.query(FeatureImportanceMeta).filter(
        FeatureImportanceMeta.phase == phase
    ).first()

    if not meta:
        raise HTTPException(status_code=404, detail="Phase not found")

    features = db.query(FeatureImportance).filter(
        FeatureImportance.phase == phase,
        FeatureImportance.quarter == quarter
    ).all()

    return {
        "meta": meta.to_dict(),
        "features": [f.to_dict() for f in features]
    }
