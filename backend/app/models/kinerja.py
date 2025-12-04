from sqlalchemy import Column, Integer, String, Float
from app.core.db import Base

class Kinerja(Base):
    __tablename__ = "kinerja"

    id = Column(Integer, primary_key=True, index=True)

    # metadata
    quarter = Column(String)
    sheet = Column(String)

    # actual columns from JSON
    nik = Column(Integer)
    name = Column(String)

    revenue = Column(Float)

    sales_datin = Column(Integer)
    sales_wifi = Column(Integer)
    sales_hsi = Column(Integer)
    sales_wireline = Column(Integer)

    profitability = Column(Float)
    collection_rate = Column(Float)

    ae_tools = Column(Float)
    nps = Column(Float)
    capability = Column(Float)
    behaviour = Column(Float)

    periode = Column(String)
    unit = Column(String)
