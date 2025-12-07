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


# -------- Build Response with Meta --------
def build_wp_response(db: Session, data):
    meta = get_best_model_metrics(db)
    return {
        "meta": meta,
        "data": [d.to_dict() for d in data],
    }


# ============================================================
# PROJECT ENDPOINTS (DIPINDAH KE ATAS AGAR TIDAK BENTROK)
# ============================================================

@router.get("/project/{lop_id}")
def get_wp_by_project(lop_id: str, db: Session = Depends(get_db)):
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.lop_id == lop_id)
        .all()
    )
    return build_wp_response(db, records)


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


# ============================================================
# AE ENDPOINTS
# ============================================================

@router.get("/ae/{ae_id}")
def get_wp_by_ae(ae_id: str, db: Session = Depends(get_db)):
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.nik == int(ae_id))
        .all()
    )
    return build_wp_response(db, records)


@router.get("/ae/{ae_id}/{quarter}")
def get_wp_by_ae_quarter(ae_id: str, quarter: str, db: Session = Depends(get_db)):
    q = unquote(quarter).strip()
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.nik == int(ae_id))
        .filter(WinProbPrediction.quarter == q)
        .all()
    )
    return build_wp_response(db, records)


# ============================================================
# GLOBAL ENDPOINTS
# ============================================================

@router.get("/all")
def get_wp_all(db: Session = Depends(get_db)):
    records = db.query(WinProbPrediction).all()
    return build_wp_response(db, records)


@router.get("/{quarter}")
def get_wp_by_quarter(quarter: str, db: Session = Depends(get_db)):
    q = unquote(quarter).strip()
    records = (
        db.query(WinProbPrediction)
        .filter(WinProbPrediction.quarter == q)
        .all()
    )
    return build_wp_response(db, records)
