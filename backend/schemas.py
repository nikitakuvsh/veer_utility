from pydantic import BaseModel
from typing import List, Optional

class ItemBase(BaseModel):
    title: str
    price: float
    description: Optional[str]
    gender: Optional[str]

class ItemCreate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: int
    images: List[str]

    class Config:
        orm_mode = True
