from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, models, dependencies

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
)

@router.get("/stats")
def get_stats(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_admin_user)
):
    total_orders = db.query(models.Order).count()
    total_revenue = db.query(models.Order).with_entities(models.Order.total_amount).all()
    revenue = sum([r[0] for r in total_revenue])
    
    pending_orders = db.query(models.Order).filter(models.Order.status == models.OrderStatus.pending).count()
    completed_orders = db.query(models.Order).filter(models.Order.status == models.OrderStatus.completed).count()

    return {
        "total_orders": total_orders,
        "total_revenue": revenue,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders
    }
