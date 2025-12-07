from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.evaluasi_kinerja import EvaluasiKinerja

router = APIRouter(prefix="/evaluasi", tags=["Evaluasi"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(EvaluasiKinerja).all()

@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(EvaluasiKinerja).filter(EvaluasiKinerja.quarter == quarter).all()