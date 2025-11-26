from fastapi import FastAPI
from .database import engine, Base
from .routers import auth, users, menu, orders, admin

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lunch Ordering System API")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Lunchie API"}
