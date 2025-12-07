from sqlalchemy import Column, Integer, String, Float
from app.core.db import Base

class Orientasi(Base):
    __tablename__ = "orientasi"

    id = Column(Integer, primary_key=True)
    quarter = Column(String)
    sheet = Column(String)

    nik = Column(Integer)
    name = Column(String)

    solution = Column(Integer)
    account_profile = Column(Integer)
    account_plan = Column(Integer)
    sales_funnel = Column(Integer)
    bidding_management = Column(Integer)
    project_management = Column(Integer)

    saran_pengembangan = Column(String)

    customer_introduction = Column(Integer)
    visiting_customer = Column(Integer)
    transfer_customer_knowledge = Column(Integer)
    transfer_customer_documentation = Column(Integer)
    customer_matching = Column(Integer)

    periode = Column(String)
    unit = Column(String)
