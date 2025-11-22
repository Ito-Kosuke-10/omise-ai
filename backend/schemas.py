from pydantic import BaseModel, EmailStr, field_validator
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


# 認証関連のスキーマ
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('パスワードは8文字以上である必要があります')
        
        # bcryptの72バイト制限をチェック（72バイトを超える場合のみエラー）
        password_bytes = v.encode("utf-8")
        byte_length = len(password_bytes)
        if byte_length > 72:
            raise ValueError(
                f'パスワードは72バイト以内で入力してください。'
                f'（現在のパスワードは{byte_length}バイトです。英数字のみの場合は72文字以内、日本語などのマルチバイト文字を含む場合は文字数が少なくなります）'
            )
        
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


