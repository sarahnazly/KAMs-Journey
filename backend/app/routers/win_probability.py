from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from urllib.parse import unquote

from app.core.db import SessionLocal
from app.models.wp import WinProbPrediction
from app.services.wp_service import get_best_model_metrics


router = APIRouter(prefix="/wp", tags=["win-probability"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------
# Base meta getter
# --------------------------
def build_wp_response(db: Session, data):
    meta = get_best_model_metrics(db)
    return {
        "meta": meta,
        "data": data,
    }


# --------------------------
# GET all WP predictions
# --------------------------
@router.get("/all")
def get_wp_all(db: Session = Depends(get_db)):
    records = db.query(WinProbPrediction).all()
    return build_wp_response(db, records)


# --------------------------
# GET WP per quarter
# --------------------------
@router.get("/{quarter}")
def get_wp_by_quarter(quarter: str, db: Session = Depends(get_db)):
    q = unquote(quarter).strip()
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.quarter == q)
        .all()
    )
    return build_wp_response(db, records)


# --------------------------
# GET WP per AE
# --------------------------
@router.get("/ae/{ae_id}")
def get_wp_by_ae(ae_id: str, db: Session = Depends(get_db)):
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.raw["nik"].astext == ae_id)
        .all()
    )
    return build_wp_response(db, records)


# --------------------------
# GET WP per AE + quarter
# --------------------------
@router.get("/ae/{ae_id}/{quarter}")
def get_wp_by_ae_quarter(ae_id: str, quarter: str, db: Session = Depends(get_db)):
    q = unquote(quarter).strip()
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.raw["nik"].astext == ae_id)
        .filter(WinProbPrediction.quarter == q)
        .all()
    )
    return build_wp_response(db, records)


# --------------------------
# GET WP per project
# --------------------------
@router.get("/project/{lop_id}")
def get_wp_by_project(lop_id: str, db: Session = Depends(get_db)):
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.lop_id == lop_id)
        .all()
    )
    return build_wp_response(db, records)


# --------------------------
# GET WP per project + quarter
# --------------------------
@router.get("/project/{lop_id}/{quarter}")
def get_wp_by_project_quarter(lop_id: str, quarter: str, db: Session = Depends(get_db)):
    q = unquote(quarter).strip()
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.lop_id == lop_id)
        .filter(WinProbPrediction.quarter == q)
        .all()
    )
    return build_wp_response(db, records)
