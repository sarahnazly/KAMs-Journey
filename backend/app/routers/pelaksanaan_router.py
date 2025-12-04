from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.pelaksanaan import Pelaksanaan

router = APIRouter(prefix="/pelaksanaan", tags=["Pelaksanaan"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(Pelaksanaan).all()

@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(Pelaksanaan).filter(Pelaksanaan.quarter == quarter).all()
