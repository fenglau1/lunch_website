from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_menu_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.MenuItem).offset(skip).limit(limit).all()

def create_menu_item(db: Session, item: schemas.MenuItemCreate):
    db_item = models.MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_menu_item(db: Session, item_id: int):
    return db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()

def update_menu_item(db: Session, item_id: int, item: schemas.MenuItemCreate):
    db_item = get_menu_item(db, item_id)
    if db_item:
        for key, value in item.dict().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_menu_item(db: Session, item_id: int):
    db_item = get_menu_item(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    db_order = models.Order(user_id=user_id, total_amount=0, status=models.OrderStatus.pending)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    total_amount = 0
    for item in order.items:
        menu_item = get_menu_item(db, item.menu_item_id)
        if not menu_item:
            continue
        price = menu_item.price
        total_amount += price * item.quantity
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            price_at_time=price
        )
        db.add(db_order_item)
    
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def get_user_orders(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Order).filter(models.Order.user_id == user_id).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def update_order_status(db: Session, order_id: int, status: models.OrderStatus):
    db_order = get_order(db, order_id)
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order
