from sqlalchemy import Column, Integer, String, Float
from app.core.db import Base

class Project(Base):
    __tablename__ = "project"

    id = Column(Integer, primary_key=True)
    quarter = Column(String)
    sheet = Column(String)

    nik = Column(Integer)
    name = Column(String)

    lop_id = Column(String)
    project_name = Column(String)
    customer_name = Column(String)

    value_projects = Column(Float)
    stage = Column(String)
    jumlah_aktivitas = Column(Integer)
    status = Column(String)

    periode = Column(String)
    unit = Column(String)
