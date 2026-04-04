"""
services/activity_service.py

👉 Core logic for Activity Tracking (✔️ ❌)
👉 Used by ALL modules
👉 Handles:
   - Mark complete ✔️
   - Reset ❌
   - Initialize activities
   - Fetch status
"""

from sqlalchemy.orm import Session
from models.activity import Activity
from constants.activities import ALL_ACTIVITIES


# =========================
# 🔥 UPDATE ACTIVITY (✔️)
# =========================
def update_activity(db: Session, faculty_id: int, module: str, activity_name: str):
    """
    Mark activity as completed ✔️
    """
    activity = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module,
        Activity.activity_name == activity_name
    ).first()

    if activity:
        activity.status = True
    else:
        # create if not exists
        activity = Activity(
            faculty_id=faculty_id,
            module=module,
            activity_name=activity_name,
            status=True
        )
        db.add(activity)

    db.commit()
    db.refresh(activity)

    return activity


# =========================
# ❌ RESET ACTIVITY
# =========================
def reset_activity(db: Session, faculty_id: int, module: str, activity_name: str):
    """
    Reset activity to pending ❌
    """
    activity = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module,
        Activity.activity_name == activity_name
    ).first()

    if not activity:
        return None

    activity.status = False
    db.commit()
    db.refresh(activity)

    return activity


# =========================
# 📊 GET ALL ACTIVITIES
# =========================
def get_all_activities(db: Session):
    return db.query(Activity).all()


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
def get_faculty_activities(db: Session, faculty_id: int):
    return db.query(Activity).filter(
        Activity.faculty_id == faculty_id
    ).all()


# =========================
# 📂 GET BY MODULE
# =========================
def get_module_activities(db: Session, faculty_id: int, module: str):
    return db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module
    ).all()


# =========================
# 🔍 GET SINGLE ACTIVITY
# =========================
def get_single_activity(
    db: Session,
    faculty_id: int,
    module: str,
    activity_name: str
):
    return db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module,
        Activity.activity_name == activity_name
    ).first()


# =========================
# 🔄 INITIALIZE ACTIVITIES
# =========================
def initialize_activities(db: Session, faculty_id: int):
    """
    Create all activities with default ❌ status
    Called after user registration
    """
    for module, activities in ALL_ACTIVITIES.items():
        for activity_name in activities:
            exists = db.query(Activity).filter(
                Activity.faculty_id == faculty_id,
                Activity.module == module,
                Activity.activity_name == activity_name
            ).first()

            if not exists:
                new_activity = Activity(
                    faculty_id=faculty_id,
                    module=module,
                    activity_name=activity_name,
                    status=False  # ❌ default
                )
                db.add(new_activity)

    db.commit()


# =========================
# 📊 GET STATUS SUMMARY
# =========================
def get_activity_summary(db: Session, faculty_id: int):
    """
    Returns completed vs pending counts
    """
    activities = db.query(Activity).filter(
        Activity.faculty_id == faculty_id
    ).all()

    total = len(activities)
    completed = sum(1 for a in activities if a.status)
    pending = total - completed

    return {
        "total": total,
        "completed": completed,
        "pending": pending
    }


# =========================
# 🔥 BULK COMPLETE (OPTIONAL)
# =========================
def complete_all_module_activities(db: Session, faculty_id: int, module: str):
    """
    Mark all activities in a module as ✔️
    """
    activities = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == module
    ).all()

    for activity in activities:
        activity.status = True

    db.commit()

    return activities