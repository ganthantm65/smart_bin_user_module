from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) 
    name = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    
    green_points = Column(Integer, default=0)
    rank = Column(Integer, default=0)
    streak = Column(Integer, default=1)
    kg_diverted = Column(Float, default=0.0)
    co2_saved = Column(Float, default=0.0)
    disposals = Column(Integer, default=0)

class BinUnit(Base):
    __tablename__ = "bin_units"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(String, unique=True, index=True, nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String, default="Active")