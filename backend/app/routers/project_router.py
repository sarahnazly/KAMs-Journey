from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.project import Project

router = APIRouter(prefix="/project", tags=["Project"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return db.query(Project).all()
@router.get("/{quarter}")
def get_by_quarter(quarter: str, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.quarter == quarter).all()