from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, dependencies

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_active_user)
):
    return crud.create_order(db=db, order=order, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Order])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_active_user)
):
    if current_user.role == models.UserRole.admin:
        return crud.get_orders(db, skip=skip, limit=limit)
    else:
        return crud.get_user_orders(db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/{order_id}", response_model=schemas.Order)
def read_order(
    order_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_active_user)
):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != models.UserRole.admin and db_order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    return db_order

@router.put("/{order_id}/status", response_model=schemas.Order)
def update_order_status(
    order_id: int,
    status: models.OrderStatus,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_admin_user)
):
    db_order = crud.update_order_status(db, order_id=order_id, status=status)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
