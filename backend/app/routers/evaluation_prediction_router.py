from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db

from app.services.evaluation_prediction_service import (
    get_prediction_detail,
)

router = APIRouter(prefix="/ep", tags=["Evaluation Predictions"])

@router.get("/{nik}/predictions")
def prediction_detail_endpoint(nik: str, quarter: str, year: int, db: Session = Depends(get_db)):
    result = get_prediction_detail(db, nik, quarter, year)
    if not result:
        raise HTTPException(404, "Prediction not found for this AE and period")
    return result
