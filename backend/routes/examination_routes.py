"""
routes/examination_routes.py

👉 Handles Examination module APIs
👉 Covers:
   - External (Time Table, Hall Tickets, Seating, Invigilation, Marks Upload, Reports)
   - Internal (Analysis, Reports)
👉 Integrated with activity tracking ✔️❌
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.examination import Examination
from models.activity import Activity
from services.activity_service import update_activity
from constants.activities import is_valid_activity

router = APIRouter(prefix="/examinations", tags=["Examinations"])


# =========================
# ✅ CREATE / PERFORM ACTION
# =========================
@router.post("/create")
def create_exam_activity(
    faculty_id: int,
    module_type: str,  # external / internal
    activity_name: str,
    description: str = "",
    exam_name: str = "",
    subject: str = "",
    class_name: str = "",
    report_type: str = "",
    hall_number: str = "",
    duty_details: str = "",
    db: Session = Depends(get_db)
):
    # 🔍 Validate activity
    if not is_valid_activity("examinations", activity_name):
        raise HTTPException(status_code=400, detail="Invalid activity")

    new_entry = Examination(
        faculty_id=faculty_id,
        module_type=module_type,
        activity_name=activity_name,
        description=description,
        exam_name=exam_name,
        subject=subject,
        class_name=class_name,
        report_type=report_type,
        hall_number=hall_number,
        duty_details=duty_details,
        status="completed"
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # 🔥 Update ✔️ status
    update_activity(
        db,
        faculty_id=faculty_id,
        module="examinations",
        activity_name=activity_name
    )

    return {
        "message": "Examination activity completed",
        "data": new_entry
    }


# =========================
# 📄 GET ALL RECORDS
# =========================
@router.get("/")
def get_all_examinations(db: Session = Depends(get_db)):
    records = db.query(Examination).all()
    return records


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    records = db.query(Examination).filter(
        Examination.faculty_id == faculty_id
    ).all()

    return records


# =========================
# 🔍 GET BY MODULE TYPE (external/internal)
# =========================
@router.get("/faculty/{faculty_id}/module/{module_type}")
def get_by_module(
    faculty_id: int,
    module_type: str,
    db: Session = Depends(get_db)
):
    records = db.query(Examination).filter(
        Examination.faculty_id == faculty_id,
        Examination.module_type == module_type
    ).all()

    return records


# =========================
# 🔍 GET BY ACTIVITY
# =========================
@router.get("/faculty/{faculty_id}/activity/{activity_name}")
def get_by_activity(
    faculty_id: int,
    activity_name: str,
    db: Session = Depends(get_db)
):
    records = db.query(Examination).filter(
        Examination.faculty_id == faculty_id,
        Examination.activity_name == activity_name
    ).all()

    return records


# =========================
# ✏️ UPDATE RECORD
# =========================
@router.put("/update/{id}")
def update_exam_record(
    id: int,
    description: str = "",
    exam_name: str = "",
    subject: str = "",
    class_name: str = "",
    report_type: str = "",
    db: Session = Depends(get_db)
):
    record = db.query(Examination).filter(Examination.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.description = description
    record.exam_name = exam_name
    record.subject = subject
    record.class_name = class_name
    record.report_type = report_type

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
def delete_exam_record(id: int, db: Session = Depends(get_db)):
    record = db.query(Examination).filter(Examination.id == id).first()

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
        Activity.module == "examinations"
    ).all()

    return status_data