"""
routes/activity_routes.py

✅ FINAL WORKING VERSION (FIXED)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.session import get_db
from models.activity import Activity
from constants.activities import ALL_ACTIVITIES, initialize_faculty_activities

# ✅ NO PREFIX HERE
router = APIRouter()


# =========================
# 📦 REQUEST MODEL
# =========================
class ActivityUpdate(BaseModel):
    faculty_id: int
    module: str
    activity_name: str


# =========================
# 📄 GET ALL ACTIVITIES
# =========================
@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return db.query(Activity).all()


# =========================
# 👨‍🏫 BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    return db.query(Activity).filter(
        Activity.faculty_id == faculty_id
    ).all()


# =========================
# 📊 BY MODULE
# =========================
@router.get("/faculty/{faculty_id}/{module}")
def get_by_module(faculty_id: int, module: str, db: Session = Depends(get_db)):
    return db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module
    ).all()


# =========================
# ✔️ COMPLETE ACTIVITY
# =========================
@router.put("/complete")
def complete(data: ActivityUpdate, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(
        Activity.faculty_id == data.faculty_id,
        Activity.module == data.module,
        Activity.activity_name == data.activity_name
    ).first()

    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity.status = True
    db.commit()
    db.refresh(activity)

    return {
        "message": "Completed",
        "data": activity
    }


# =========================
# ❌ RESET ACTIVITY
# =========================
@router.put("/reset")
def reset(data: ActivityUpdate, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(
        Activity.faculty_id == data.faculty_id,
        Activity.module == data.module,
        Activity.activity_name == data.activity_name
    ).first()

    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity.status = False
    db.commit()
    db.refresh(activity)

    return {
        "message": "Reset",
        "data": activity
    }


# =========================
# 🔄 INITIALIZE ACTIVITIES
# =========================
@router.post("/initialize/{faculty_id}")
def init_activities(faculty_id: int, db: Session = Depends(get_db)):
    initialize_faculty_activities(db, faculty_id, Activity)
    return {"message": "Initialized successfully"}


# =========================
# 📋 GET ALL MODULES
# =========================
@router.get("/all-modules")
def modules():
    return ALL_ACTIVITIES