from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.pengembangan import Pengembangan

router = APIRouter(prefix="/pengembangan", tags=["Pengembangan"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(Pengembangan).all()

@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(Pengembangan).filter(Pengembangan.quarter == quarter).all()