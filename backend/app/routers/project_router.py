from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.project import Project

router = APIRouter(prefix="/project", tags=["Project"])


# ------------------------------------------------
# GET all projects
# ------------------------------------------------
@router.get("/all")
def get_all_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


# ------------------------------------------------
# GET projects per quarter
# ------------------------------------------------
@router.get("/quarter/{quarter}")
def get_projects_by_quarter(quarter: str, db: Session = Depends(get_db)):
    rows = db.query(Project).filter(Project.quarter == quarter).all()
    return rows


# ------------------------------------------------
# GET projects per AE (by NIK)
# ------------------------------------------------
@router.get("/ae/{nik}")
def get_projects_by_ae(nik: int, db: Session = Depends(get_db)):
    rows = db.query(Project).filter(Project.nik == nik).all()

    if not rows:
        raise HTTPException(status_code=404, detail="No projects found for this AE")

    return rows


# ------------------------------------------------
# GET projects per AE & per quarter
# ------------------------------------------------
@router.get("/ae/{nik}/{quarter}")
def get_projects_by_ae_quarter(nik: int, quarter: str, db: Session = Depends(get_db)):
    rows = (
        db.query(Project)
        .filter(Project.nik == nik)
        .filter(Project.quarter == quarter)
        .all()
    )

    if not rows:
        raise HTTPException(
            status_code=404,
            detail=f"No projects found for AE {nik} in quarter {quarter}"
        )

    return rows
