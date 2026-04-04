"""
routes/activity_routes.py

👉 Handles activity tracking (✔️ ❌)
👉 Central API for all modules
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.session import get_db
from models.activity import Activity
from constants.activities import ALL_ACTIVITIES
from constants.activities import initialize_faculty_activities

router = APIRouter(prefix="/activity", tags=["Activity"])


# =========================
# 📄 GET ALL ACTIVITIES
# =========================
@router.get("/")
def get_all_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).all()
    return activities


# =========================
# 👨‍🏫 GET ACTIVITIES BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_faculty_activities(faculty_id: int, db: Session = Depends(get_db)):
    activities = db.query(Activity).filter(
        Activity.faculty_id == faculty_id
    ).all()

    return activities


# =========================
# 📊 GET ACTIVITIES BY MODULE
# =========================
@router.get("/faculty/{faculty_id}/{module}")
def get_module_activities(
    faculty_id: int,
    module: str,
    db: Session = Depends(get_db)
):
    activities = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module
    ).all()

    return activities


# =========================
# ✔️ MARK ACTIVITY AS COMPLETED
# =========================
@router.put("/complete")
def mark_completed(
    faculty_id: int,
    module: str,
    activity_name: str,
    db: Session = Depends(get_db)
):
    activity = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module,
        Activity.activity_name == activity_name
    ).first()

    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity.status = True  # ✔️
    db.commit()
    db.refresh(activity)

    return {"message": "Activity marked as completed", "data": activity}


# =========================
# ❌ RESET ACTIVITY
# =========================
@router.put("/reset")
def reset_activity(
    faculty_id: int,
    module: str,
    activity_name: str,
    db: Session = Depends(get_db)
):
    activity = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module,
        Activity.activity_name == activity_name
    ).first()

    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity.status = False  # ❌
    db.commit()
    db.refresh(activity)

    return {"message": "Activity reset to pending", "data": activity}


# =========================
# 🔄 INITIALIZE ACTIVITIES (VERY IMPORTANT)
# =========================
@router.post("/initialize/{faculty_id}")
def initialize_activities(faculty_id: int, db: Session = Depends(get_db)):
    """
    👉 Call this after user registration
    👉 Creates all activities with ❌ status
    """
    initialize_faculty_activities(db, faculty_id, Activity)

    return {"message": "Activities initialized successfully"}


# =========================
# 📋 GET ALL MODULES & ACTIVITIES
# =========================
@router.get("/all-modules")
def get_all_modules():
    """
    👉 Send to frontend for sidebar generation
    """
    return ALL_ACTIVITIES