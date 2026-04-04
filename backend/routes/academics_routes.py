"""
routes/academics_routes.py

👉 Handles all Academics APIs
👉 Integrated with activity tracking ✔️❌
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.session import get_db
from models.academics import Academics
from models.activity import Activity
from services.activity_service import update_activity
from constants.activities import is_valid_activity

router = APIRouter(prefix="/academics", tags=["Academics"])


# =========================
# ✅ CREATE ACTIVITY
# =========================
@router.post("/create")
def create_academic_activity(
    faculty_id: int,
    activity_name: str,
    description: str = "",
    subject: str = "",
    class_name: str = "",
    db: Session = Depends(get_db)
):
    # 🔍 Validate activity
    if not is_valid_activity("academics", activity_name):
        raise HTTPException(status_code=400, detail="Invalid activity")

    new_record = Academics(
        faculty_id=faculty_id,
        activity_name=activity_name,
        description=description,
        subject=subject,
        class_name=class_name,
        status="completed"
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    # 🔥 Update ✔️ status
    update_activity(
        db,
        faculty_id=faculty_id,
        module="academics",
        activity_name=activity_name
    )

    return {
        "message": "Academics activity created",
        "data": new_record
    }


# =========================
# 📄 GET ALL RECORDS
# =========================
@router.get("/")
def get_all_academics(db: Session = Depends(get_db)):
    records = db.query(Academics).all()
    return records


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    records = db.query(Academics).filter(
        Academics.faculty_id == faculty_id
    ).all()

    return records


# =========================
# ✏️ UPDATE RECORD
# =========================
@router.put("/update/{id}")
def update_academic(
    id: int,
    description: str = "",
    subject: str = "",
    class_name: str = "",
    db: Session = Depends(get_db)
):
    record = db.query(Academics).filter(Academics.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.description = description
    record.subject = subject
    record.class_name = class_name

    db.commit()
    db.refresh(record)

    return {"message": "Updated successfully", "data": record}


# =========================
# ❌ DELETE RECORD
# =========================
@router.delete("/delete/{id}")
def delete_academic(id: int, db: Session = Depends(get_db)):
    record = db.query(Academics).filter(Academics.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()

    return {"message": "Deleted successfully"}


# =========================
# 📊 GET STATUS (✔️❌)
# =========================
@router.get("/status/{faculty_id}")
def get_status(faculty_id: int, db: Session = Depends(get_db)):
    status_data = db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == "academics"
    ).all()

    return status_data