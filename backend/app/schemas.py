from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole, OrderStatus

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.user

class User(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    category: str
    is_available: bool = True
    date: Optional[datetime] = None

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    price_at_time: float
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    pass

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: float
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True
