from sqlalchemy import Column, Integer, String, Float, Text, ARRAY
from .database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(Text)
    gender = Column(String)
    images = Column(ARRAY(String))
