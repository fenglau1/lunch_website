# Lunch Ordering System

A full-stack lunch ordering system for colleagues with an admin dashboard and payment tracking.

## Tech Stack
- **Frontend**: Next.js (React) + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose

## Features
- **User**: View menu, place orders, view order history.
- **Admin**: Manage menu items, view all orders, update order status, view analytics.
- **Auth**: JWT-based authentication with role-based access control.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed.

### Running with Docker
1. Clone the repository.
2. Run `docker-compose up --build`.
3. Access the application:
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8000`
    - API Docs: `http://localhost:8000/docs`

### Running Locally (Development)

#### Backend
1. Navigate to `backend/`.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn app.main:app --reload`

#### Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

### Database Seeding
To populate the database with sample data (Admin user, regular user, menu items):
1. Ensure the backend is running or the database container is up.
2. Run `python backend/seed.py` (you might need to adjust the database URL in `backend/app/database.py` if running outside Docker).

## Default Credentials
- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`
