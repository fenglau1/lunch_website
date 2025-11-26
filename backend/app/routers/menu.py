from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, dependencies

router = APIRouter(
    prefix="/menu",
    tags=["menu"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.MenuItem])
def read_menu_items(skip: int = 0, limit: int = 100, db: Session = Depends(dependencies.get_db)):
    items = crud.get_menu_items(db, skip=skip, limit=limit)
    return items

@router.post("/", response_model=schemas.MenuItem)
def create_menu_item(
    item: schemas.MenuItemCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_admin_user)
):
    return crud.create_menu_item(db=db, item=item)

@router.get("/{item_id}", response_model=schemas.MenuItem)
def read_menu_item(item_id: int, db: Session = Depends(dependencies.get_db)):
    db_item = crud.get_menu_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.MenuItem)
def update_menu_item(
    item_id: int,
    item: schemas.MenuItemCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_admin_user)
):
    db_item = crud.update_menu_item(db, item_id=item_id, item=item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item

@router.delete("/{item_id}", response_model=schemas.MenuItem)
def delete_menu_item(
    item_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_admin_user)
):
    db_item = crud.delete_menu_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item
