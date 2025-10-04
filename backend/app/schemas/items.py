from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


# ========== Grocery Schemas ==========

class GroceryBase(BaseModel):
    name: str
    quantity: Optional[int] = 1


class GroceryCreate(GroceryBase):
    list_id: UUID


class GroceryUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    bought: Optional[bool] = None


class GroceryOut(GroceryBase):
    id: int
    list_id: UUID
    category: str
    bought: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ========== Shopping List Schemas ==========

class ListOut(BaseModel):
    id: UUID
    name: str
    share_code: str
    created_at: datetime

    class Config:
        orm_mode = True
