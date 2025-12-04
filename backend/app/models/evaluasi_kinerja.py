from sqlalchemy import Column, Integer, String, Float
from app.core.db import Base

class EvaluasiKinerja(Base):
    __tablename__ = "evaluasi_kinerja"

    id = Column(Integer, primary_key=True, index=True)
    quarter = Column(String)

    nik = Column(Integer)
    name = Column(String)

    revenue_sales_achievement = Column(Float)
    sales_achievement_datin = Column(Float)
    sales_achievement_wifi = Column(Float)
    sales_achievement_hsi = Column(Float)
    sales_achievement_wireline = Column(Float)
    profitability_achievement = Column(Float)
    collection_rate_achievement = Column(Float)
    nps_achievement = Column(Float)
    ae_tools_achievement = Column(Float)
    capability_achievement = Column(Float)
    behaviour_achievement = Column(Float)

    overall_score = Column(Float)
    kuadran = Column(Integer)

    periode = Column(String)
    unit = Column(String)
