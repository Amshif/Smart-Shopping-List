from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Session
import uuid

from app.db.database import Base
from app.schemas.items import GroceryCreate, GroceryUpdate
from app.utils.auto_categorize import auto_categorize


# ========== SQLAlchemy MODELS ==========

class ShoppingList(Base):
    __tablename__ = "shopping_lists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, default="My Grocery List")
    share_code = Column(String, unique=True, default=lambda: uuid.uuid4().hex[:8])
    is_public = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    items = relationship("GroceryItem", back_populates="list", cascade="all, delete")


class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    list_id = Column(UUID(as_uuid=True), ForeignKey("shopping_lists.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    category = Column(String, default="Others")
    bought = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    list = relationship("ShoppingList", back_populates="items")


# ========== CRUD FUNCTIONS ==========

# 1️⃣ Create a new shopping list
def create_list(db: Session, name: str = "My Grocery List"):
    new_list = ShoppingList(name=name)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list


# 2️⃣ Add new grocery item
def add_item(db: Session, item_data: GroceryCreate):
    category = auto_categorize(item_data.name)
    new_item = GroceryItem(
        list_id=item_data.list_id,
        name=item_data.name,
        quantity=item_data.quantity,
        category=category,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


# 3️⃣ Get all items in a list
def get_items(db: Session, list_id: str):
    return db.query(GroceryItem).filter(GroceryItem.list_id == list_id).order_by(GroceryItem.created_at.desc()).all()


# 4️⃣ Update item (mark bought / update quantity)
def update_item(db: Session, item_id: int, item_update: GroceryUpdate):
    item = db.query(GroceryItem).filter(GroceryItem.id == item_id).first()
    if not item:
        return None

    if item_update.name is not None:
        item.name = item_update.name
        item.category = auto_categorize(item_update.name)
    if item_update.quantity is not None:
        item.quantity = item_update.quantity
    if item_update.bought is not None:
        item.bought = item_update.bought

    db.commit()
    db.refresh(item)
    return item


# 5️⃣ Delete item
def delete_item(db: Session, item_id: int):
    item = db.query(GroceryItem).filter(GroceryItem.id == item_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
