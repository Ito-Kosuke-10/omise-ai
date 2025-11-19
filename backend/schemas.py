from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BusinessPlanInput(BaseModel):
    type: str
    seats: int
    atv: int
    hours: str
    area: str

class MenuExample(BaseModel):
    name: str
    price: int
    description: str

class BusinessPlanOutput(BaseModel):
    id: int
    type: str
    seats: int
    atv: int
    hours: str
    area: str
    turnover: float
    daily_guests: int
    monthly_sales: int
    cogs_rate: float
    cogs: int
    gross_profit: int
    labor_cost: int
    fixed_cost: int
    op_income: int
    payback_months: int
    concept: Optional[str]
    action: Optional[str]
    # 拡張フィールド
    catch_copy: Optional[str] = None
    target_audience: Optional[str] = None
    menu_examples: Optional[List[MenuExample]] = None
    sns_strategy: Optional[str] = None
    staff_count: Optional[int] = None
    peak_operation: Optional[str] = None
    initial_investment: Optional[int] = None
    opening_cost: Optional[int] = None
    funding_methods: Optional[List[str]] = None
    seat_occupancy_rate: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


