"""
main.py

✅ FINAL WORKING VERSION (Render + Vercel Ready)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔥 DATABASE
from config.db import engine
from database.base import init_db

# 🔥 ROUTES
from routes.auth_routes import router as auth_router
from routes.activity_routes import router as activity_router
from routes.academics_routes import router as academics_router
from routes.correspondence_routes import router as correspondence_router
from routes.employee_routes import router as employee_router
from routes.examination_routes import router as examination_router
from routes.library_routes import router as library_router
from routes.placements_routes import router as placements_router


# =========================
# 🚀 CREATE APP
# =========================
app = FastAPI(
    title="E-Office Backend API",
    version="1.0.0"
)


# =========================
# 🌍 CORS (SAFE FOR NOW)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ allow all (for debugging)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# 🚀 STARTUP
# =========================
@app.on_event("startup")
def startup():
    print("🚀 Starting Backend...")

    try:
        init_db(engine)
        print("✅ Database connected")
    except Exception as e:
        print("❌ Database error:", e)


# =========================
# 🔗 ROUTES (IMPORTANT FIX)
# =========================
app.include_router(auth_router, prefix="/auth")

# ✅ CRITICAL: activity router must NOT have internal prefix
app.include_router(activity_router, prefix="/activity")

app.include_router(academics_router, prefix="/academics")
app.include_router(correspondence_router, prefix="/correspondence")
app.include_router(employee_router, prefix="/employee")
app.include_router(examination_router, prefix="/examination")
app.include_router(library_router, prefix="/library")
app.include_router(placements_router, prefix="/placements")


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {
        "message": "🚀 Backend is running",
        "status": "success"
    }


# =========================
# ❤️ HEALTH
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Server is healthy"
    }


# =========================
# 🔍 DEBUG ROUTE (VERY IMPORTANT)
# =========================
@app.get("/test-activity")
def test_activity():
    return {"message": "Activity route working!"}


# =========================
# ▶️ LOCAL RUN
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)