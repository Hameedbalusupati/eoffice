"""
services/academics_service.py

👉 Business logic for Academics module
👉 Handles CRUD operations
👉 Integrates with activity tracking ✔️❌
"""

from sqlalchemy.orm import Session
from models.academics import Academics
from services.activity_service import update_activity
from constants.activities import is_valid_activity


# =========================
# ✅ CREATE ACTIVITY
# =========================
def create_academic_activity(
    db: Session,
    faculty_id: int,
    activity_name: str,
    description: str = "",
    subject: str = "",
    class_name: str = "",
    status: str = None  # 🔥 NEW
):
    # 🔍 Validate activity
    if not is_valid_activity("academics", activity_name):
        raise ValueError("Invalid activity name")

    # =========================
    # 🔥 AUTO STATUS LOGIC
    # =========================
    if status:
        final_status = status
    else:
        # 👉 Default rules
        if activity_name == "leisure_time":
            final_status = "pending"
        else:
            final_status = "completed"

    # =========================
    # 📦 CREATE RECORD
    # =========================
    new_record = Academics(
        faculty_id=faculty_id,
        activity_name=activity_name,
        description=description,
        subject=subject,
        class_name=class_name,
        status=final_status
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    # =========================
    # 🔥 UPDATE ACTIVITY TRACKING
    # =========================
    # ❗ Only mark ✔️ if completed
    if final_status == "completed":
        update_activity(
            db,
            faculty_id=faculty_id,
            module="academics",
            activity_name=activity_name
        )

    return new_record


# =========================
# 📄 GET ALL RECORDS
# =========================
def get_all_academics(db: Session):
    return db.query(Academics).all()


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
def get_academics_by_faculty(db: Session, faculty_id: int):
    return db.query(Academics).filter(
        Academics.faculty_id == faculty_id
    ).all()


# =========================
# 🔍 GET BY ACTIVITY
# =========================
def get_academics_by_activity(
    db: Session,
    faculty_id: int,
    activity_name: str
):
    return db.query(Academics).filter(
        Academics.faculty_id == faculty_id,
        Academics.activity_name == activity_name
    ).all()


# =========================
# ✏️ UPDATE RECORD
# =========================
def update_academic_record(
    db: Session,
    record_id: int,
    description: str = "",
    subject: str = "",
    class_name: str = ""
):
    record = db.query(Academics).filter(
        Academics.id == record_id
    ).first()

    if not record:
        return None

    record.description = description
    record.subject = subject
    record.class_name = class_name

    db.commit()
    db.refresh(record)

    return record


# =========================
# ❌ DELETE RECORD
# =========================
def delete_academic_record(db: Session, record_id: int):
    record = db.query(Academics).filter(
        Academics.id == record_id
    ).first()

    if not record:
        return False

    db.delete(record)
    db.commit()

    return True