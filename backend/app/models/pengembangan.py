from sqlalchemy import Column, Integer, String, Float
from app.core.db import Base

class Pengembangan(Base):
    __tablename__ = "pengembangan"

    id = Column(Integer, primary_key=True)
    quarter = Column(String)
    sheet = Column(String)

    nik = Column(Integer)
    name = Column(String)

    coaching_result_informal = Column(Float)
    lesson_learned_informal = Column(String)

    course_name = Column(String)
    certificate_id = Column(String)

    coaching_result_formal = Column(Float)
    lesson_learned_formal = Column(String)

    periode = Column(String)
    unit = Column(String)
