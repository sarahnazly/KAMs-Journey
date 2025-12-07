from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from statistics import mean
from app.core.db import get_db
from app.models.orientasi import Orientasi

router = APIRouter(prefix="/orientasi", tags=["Orientasi"])


# ============================================================
# Helper: hitung Basic Understanding, Twinning, Customer Matching
# ============================================================
def compute_summary(o: Orientasi):
    basic_understanding = mean([
        o.solution or 0,
        o.account_profile or 0,
        o.account_plan or 0,
        o.sales_funnel or 0,
        o.bidding_management or 0,
        o.project_management or 0,
    ])

    twinning = mean([
        o.customer_introduction or 0,
        o.visiting_customer or 0,
        o.transfer_customer_knowledge or 0,
        o.transfer_customer_documentation or 0,
    ])

    return {
        "nik": o.nik,
        "name": o.name,
        "unit": o.unit,
        "periode": o.periode,
        "basic_understanding": basic_understanding,
        "twinning": twinning,
        "customer_matching": o.customer_matching,
    }


@router.get("/")
def get_all_summary(db: Session = Depends(get_db)):
    rows = db.query(Orientasi).all()
    return [compute_summary(r) for r in rows]

@router.get("/quarter/{quarter}")
def get_summary_by_quarter(quarter: str, db: Session = Depends(get_db)):
    rows = db.query(Orientasi).filter(Orientasi.quarter == quarter).all()
    return [compute_summary(r) for r in rows]

@router.get("/nik/{nik}")
def get_detail_by_nik(nik: int, db: Session = Depends(get_db)):
    rows = db.query(Orientasi).filter(Orientasi.nik == nik).all()
    if not rows:
        raise HTTPException(status_code=404, detail="NIK not found")
    return rows

@router.get("/nik/{nik}/quarter/{quarter}")
def get_detail_by_nik_quarter(nik: int, quarter: str, db: Session = Depends(get_db)):
    row = db.query(Orientasi).filter(
        Orientasi.nik == nik,
        Orientasi.quarter == quarter
    ).first()

    if not row:
        raise HTTPException(status_code=404, detail="Data not found")
    return row