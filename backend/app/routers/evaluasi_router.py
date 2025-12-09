from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app. models.evaluasi_kinerja import EvaluasiKinerja

router = APIRouter(prefix="/evaluasi", tags=["Evaluasi"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(EvaluasiKinerja).all()


@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(EvaluasiKinerja).filter(EvaluasiKinerja. quarter == quarter).all()


@router.get("/ae/{nik}")
def get_by_nik(nik: int, quarter: str, db: Session = Depends(get_db)):
    result = db.query(EvaluasiKinerja).filter(
        EvaluasiKinerja.nik == nik,
        EvaluasiKinerja.quarter == quarter
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for NIK {nik} in quarter {quarter}"
        )
    
    return result