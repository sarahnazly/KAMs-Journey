from sqlalchemy import Column, Integer, String, Float, JSON
from app.core.db import Base

class EvaluationPredictionMeta(Base):
    __tablename__ = "ep_meta"

    id = Column(Integer, primary_key=True, index=True)
    prediction_quarter = Column(String, index=True)
    prediction_year = Column(Integer)
    generated_date = Column(String)
    best_regressor = Column(String)
    best_classifier = Column(String)
    model_metrics = Column(JSON)


class EvaluationPrediction(Base):
    __tablename__ = "ep_predictions"

    id = Column(Integer, primary_key=True, index=True)

    nik = Column(Integer, index=True)
    name = Column(String)

    # NEW — must match pipeline JSON
    prediction_quarter = Column(String, index=True)
    prediction_year = Column(Integer, index=True)

    predicted_kuadran = Column(Integer)
    prediction_confidence = Column(Float)

    predictions_json = Column(JSON)  # all 11 regression results
    raw_json = Column(JSON)          # optional, full row backup