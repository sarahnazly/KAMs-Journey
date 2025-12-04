from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.orientasi import Orientasi

router = APIRouter(prefix="/orientasi", tags=["Orientasi"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(Orientasi).all()

@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(Orientasi).filter(Orientasi.quarter == quarter).all()
