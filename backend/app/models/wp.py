from sqlalchemy import Column, Integer, String, Float, JSON
from app.core.db import Base

# ------------------------------------------
# 1. Win Probability Model Metadata
# ------------------------------------------
class WinProbMeta(Base):
    __tablename__ = "wp_meta"

    id = Column(Integer, primary_key=True, index=True)
    best_model_name = Column(String)
    metrics = Column(JSON)

    def to_dict(self):
        return {
            "best_model_name": self.best_model_name,
            "metrics": self.metrics
        }


# ------------------------------------------
# 2. Win Probability Predictions
# ------------------------------------------
class WinProbPrediction(Base):
    __tablename__ = "wp_predictions"

    id = Column(Integer, primary_key=True, index=True)
    quarter = Column(String, index=True)

    # AE identity
    nik = Column(Integer)
    name = Column(String)
    unit = Column(String)

    # project identity
    lop_id = Column(String)
    project_name = Column(String)
    customer_name = Column(String)
    stage = Column(String)
    status = Column(String)

    # numeric values
    value_projects = Column(Float)
    jumlah_aktivitas = Column(Float)

    # model predictions
    win_probability = Column(Float)
    win_probability_pct = Column(Float)
    predicted_class = Column(String)
    top_positive_factors = Column(String)
    top_negative_factors = Column(String)

    def to_dict(self):
        return {
            "quarter": self.quarter,
            "nik": self.nik,
            "name": self.name,
            "unit": self.unit,
            "lop_id": self.lop_id,
            "project_name": self.project_name,
            "customer_name": self.customer_name,
            "stage": self.stage,
            "status": self.status,
            "value_projects": self.value_projects,
            "jumlah_aktivitas": self.jumlah_aktivitas,
            "win_probability": self.win_probability,
            "win_probability_pct": self.win_probability_pct,
            "predicted_class": self.predicted_class,
            "top_positive_factors": self.top_positive_factors,
            "top_negative_factors": self.top_negative_factors,
        }
