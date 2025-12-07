from sqlalchemy import Column, Integer, String, Float, BigInteger
from app.core.db import Base

class Pelaksanaan(Base):
    __tablename__ = "pelaksanaan"

    id = Column(Integer, primary_key=True)
    quarter = Column(String)
    sheet = Column(String)

    nik = Column(Integer)
    name = Column(String)

    account_profile_duty = Column(Float)
    account_plan_duty = Column(Float)
    customer_requirement = Column(Float)
    identifikasi_potensi_proyek = Column(Integer)

    prebid_preparation = Column(Integer)
    risk_project_assessment = Column(Integer)
    proses_delivery = Column(Integer)

    invoice_pelanggan = Column(Float)
    customer_key_person = Column(Float)

    periode = Column(String)
    unit = Column(String)
