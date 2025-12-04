from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.kinerja import Kinerja

router = APIRouter(prefix="/kinerja", tags=["Kinerja"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(Kinerja).all()

@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(Kinerja).filter(Kinerja.quarter == quarter).all()