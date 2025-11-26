from app.database import SessionLocal, engine, Base
from app import models, auth
from app.models import UserRole

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create Admin
    admin_email = "admin@lunchie.com"
    admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not admin:
        print("Creating admin user...")
        hashed_password = auth.get_password_hash("admin123")
        admin = models.User(
            username="admin",
            email=admin_email,
            hashed_password=hashed_password,
            role=UserRole.admin
        )
        db.add(admin)
    
    # Create User
    user_email = "user@lunchie.com"
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        print("Creating regular user...")
        hashed_password = auth.get_password_hash("user123")
        user = models.User(
            username="user",
            email=user_email,
            hashed_password=hashed_password,
            role=UserRole.user
        )
        db.add(user)

    # Create Menu Items
    if db.query(models.MenuItem).count() == 0:
        print("Creating menu items...")
        items = [
            models.MenuItem(
                name="Grilled Chicken Salad",
                description="Fresh greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette.",
                price=12.50,
                category="Main Course",
                is_available=True
            ),
            models.MenuItem(
                name="Vegetarian Pizza",
                description="Thin crust pizza with bell peppers, onions, mushrooms, and olives.",
                price=14.00,
                category="Main Course",
                is_available=True
            ),
            models.MenuItem(
                name="Cheeseburger",
                description="Juicy beef patty with cheddar cheese, lettuce, tomato, and pickles.",
                price=11.00,
                category="Main Course",
                is_available=True
            ),
            models.MenuItem(
                name="Caesar Salad",
                description="Romaine lettuce with parmesan cheese, croutons, and caesar dressing.",
                price=9.50,
                category="Appetizer",
                is_available=True
            ),
            models.MenuItem(
                name="Chocolate Brownie",
                description="Rich chocolate brownie with walnuts.",
                price=4.50,
                category="Dessert",
                is_available=True
            ),
        ]
        db.add_all(items)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
