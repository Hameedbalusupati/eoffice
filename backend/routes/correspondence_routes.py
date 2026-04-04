"""
routes/correspondence_routes.py

👉 Handles all Correspondence APIs
👉 Covers SMS, Inbox, Complaints, Greetings, etc.
👉 Integrated with activity tracking ✔️❌
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.correspondence import Correspondence
from models.activity import Activity
from services.activity_service import update_activity
from constants.activities import is_valid_activity

router = APIRouter(prefix="/correspondence", tags=["Correspondence"])


# =========================
# ✅ CREATE MESSAGE / ACTION
# =========================
@router.post("/create")
def create_correspondence(
    faculty_id: int,
    activity_name: str,
    subject: str = "",
    message: str = "",
    receiver_type: str = "",
    receiver_id: int = None,
    sms_type: str = "",
    db: Session = Depends(get_db)
):
    # 🔍 Validate activity
    if not is_valid_activity("correspondence", activity_name):
        raise HTTPException(status_code=400, detail="Invalid activity")

    new_entry = Correspondence(
        faculty_id=faculty_id,
        activity_name=activity_name,
        subject=subject,
        message=message,
        receiver_type=receiver_type,
        receiver_id=receiver_id,
        sms_type=sms_type,
        status="sent"
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # 🔥 Update ✔️ status
    update_activity(
        db,
        faculty_id=faculty_id,
        module="correspondence",
        activity_name=activity_name
    )

    return {
        "message": "Correspondence action completed",
        "data": new_entry
    }


# =========================
# 📄 GET ALL RECORDS
# =========================
@router.get("/")
def get_all_correspondence(db: Session = Depends(get_db)):
    records = db.query(Correspondence).all()
    return records


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    records = db.query(Correspondence).filter(
        Correspondence.faculty_id == faculty_id
    ).all()

    return records


# =========================
# 📩 GET BY ACTIVITY TYPE
# =========================
@router.get("/faculty/{faculty_id}/{activity_name}")
def get_by_activity(
    faculty_id: int,
    activity_name: str,
    db: Session = Depends(get_db)
):
    records = db.query(Correspondence).filter(
        Correspondence.faculty_id == faculty_id,
        Correspondence.activity_name == activity_name
    ).all()

    return records


# =========================
# ✏️ UPDATE RECORD
# =========================
@router.put("/update/{id}")
def update_correspondence(
    id: int,
    subject: str = "",
    message: str = "",
    db: Session = Depends(get_db)
):
    record = db.query(Correspondence).filter(Correspondence.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.subject = subject
    record.message = message

    db.commit()
    db.refresh(record)

    return {
        "message": "Updated successfully",
        "data": record
    }


# =========================
# ❌ DELETE RECORD
# =========================
@router.delete("/delete/{id}")
def delete_correspondence(id: int, db: Session = Depends(get_db)):
    record = db.query(Correspondence).filter(Correspondence.id == id).first()

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
        Activity.module == "correspondence"
    ).all()

    return status_data