from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.shared.dependencies import get_db
from app.schemas import items as schemas
from app.models import items as models

router = APIRouter( tags=["Grocery List"])


# ========== SHOPPING LIST ROUTES ==========

@router.post("/list", response_model=schemas.ListOut)
def create_list(name: str = "My Grocery List", db: Session = Depends(get_db)):
    return models.create_list(db, name)


# ========== GROCERY ITEM ROUTES ==========

@router.post("/items", response_model=schemas.GroceryOut)
def add_item(item: schemas.GroceryCreate, db: Session = Depends(get_db)):
    return models.add_item(db, item)


@router.get("/items", response_model=list[schemas.GroceryOut])
def get_all_items(list_id: UUID, db: Session = Depends(get_db)):
    items = models.get_items(db, list_id)
    return items


@router.put("/items/{item_id}", response_model=schemas.GroceryOut)
def update_item(item_id: int, item: schemas.GroceryUpdate, db: Session = Depends(get_db)):
    updated = models.update_item(db, item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated


@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    success = models.delete_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}
