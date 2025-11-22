from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class BusinessPlan(Base):
    __tablename__ = "business_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)
    seats = Column(Integer, nullable=False)
    atv = Column(Integer, nullable=False)
    hours = Column(String(50), nullable=False)
    area = Column(String(50), nullable=False)
    
    turnover = Column(Float, nullable=False)
    daily_guests = Column(Integer, nullable=False)
    monthly_sales = Column(Integer, nullable=False)
    cogs_rate = Column(Float, nullable=False)
    cogs = Column(Integer, nullable=False)
    gross_profit = Column(Integer, nullable=False)
    labor_cost = Column(Integer, nullable=False)
    fixed_cost = Column(Integer, nullable=False)
    op_income = Column(Integer, nullable=False)
    payback_months = Column(Integer, nullable=False)
    
    concept = Column(Text)
    action = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


