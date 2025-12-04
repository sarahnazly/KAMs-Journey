from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base

class FeatureImportanceMeta(Base):
    __tablename__ = "fi_meta"

    id = Column(Integer, primary_key=True, index=True)
    phase = Column(String, index=True)
    phase_config = Column(JSON)
    best_regressor = Column(String)
    metrics_overall = Column(JSON)
    metrics_by_quarter = Column(JSON)

    features = relationship(
        "FeatureImportance",
        back_populates="meta",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "phase": self.phase,
            "phase_config": self.phase_config,
            "best_regressor": self.best_regressor,
            "metrics_overall": self.metrics_overall,
            "metrics_by_quarter": self.metrics_by_quarter
        }


class FeatureImportance(Base):
    __tablename__ = "fi_features"

    id = Column(Integer, primary_key=True, index=True)
    meta_id = Column(Integer, ForeignKey("fi_meta.id"))
    phase = Column(String, index=True)
    quarter = Column(String)
    feature = Column(String)
    importance = Column(Float)
    description = Column(String)

    meta = relationship("FeatureImportanceMeta", back_populates="features")

    def to_dict(self):
        return {
            "phase": self.phase,
            "quarter": self.quarter,
            "feature": self.feature,
            "importance": self.importance,
            "description": self.description
        }
