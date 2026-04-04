"""
routes/placements_routes.py

👉 Handles Placements module APIs
👉 Covers:
   - Companies
   - Internship (Report, Details, Status)
   - Offers
   - Reports
   - Student Performance
👉 Integrated with activity tracking ✔️❌
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.placements import Placement
from models.activity import Activity
from services.activity_service import update_activity
from constants.activities import is_valid_activity

router = APIRouter(prefix="/placements", tags=["Placements"])


# =========================
# ✅ CREATE / PERFORM ACTION
# =========================
@router.post("/create")
def create_placement_activity(
    faculty_id: int,
    activity_name: str,
    description: str = "",
    company_name: str = "",
    company_location: str = "",
    student_name: str = "",
    student_roll_no: str = "",
    department: str = "",
    internship_title: str = "",
    internship_status: str = "",
    internship_duration: str = "",
    offer_role: str = "",
    offer_salary: str = "",
    offer_status: str = "",
    report_type: str = "",
    performance_score: str = "",
    db: Session = Depends(get_db)
):
    # 🔍 Validate activity
    if not is_valid_activity("placements", activity_name):
        raise HTTPException(status_code=400, detail="Invalid activity")

    new_entry = Placement(
        faculty_id=faculty_id,
        activity_name=activity_name,
        description=description,
        company_name=company_name,
        company_location=company_location,
        student_name=student_name,
        student_roll_no=student_roll_no,
        department=department,
        internship_title=internship_title,
        internship_status=internship_status,
        internship_duration=internship_duration,
        offer_role=offer_role,
        offer_salary=offer_salary,
        offer_status=offer_status,
        report_type=report_type,
        performance_score=performance_score,
        status="completed"
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # 🔥 Update ✔️ status
    update_activity(
        db,
        faculty_id=faculty_id,
        module="placements",
        activity_name=activity_name
    )

    return {
        "message": "Placement activity completed",
        "data": new_entry
    }


# =========================
# 📄 GET ALL RECORDS
# =========================
@router.get("/")
def get_all_placements(db: Session = Depends(get_db)):
    return db.query(Placement).all()


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    return db.query(Placement).filter(
        Placement.faculty_id == faculty_id
    ).all()


# =========================
# 🔍 GET BY ACTIVITY
# =========================
@router.get("/faculty/{faculty_id}/activity/{activity_name}")
def get_by_activity(
    faculty_id: int,
    activity_name: str,
    db: Session = Depends(get_db)
):
    return db.query(Placement).filter(
        Placement.faculty_id == faculty_id,
        Placement.activity_name == activity_name
    ).all()


# =========================
# ✏️ UPDATE RECORD
# =========================
@router.put("/update/{id}")
def update_placement_record(
    id: int,
    description: str = "",
    company_name: str = "",
    student_name: str = "",
    offer_role: str = "",
    report_type: str = "",
    performance_score: str = "",
    db: Session = Depends(get_db)
):
    record = db.query(Placement).filter(Placement.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.description = description
    record.company_name = company_name
    record.student_name = student_name
    record.offer_role = offer_role
    record.report_type = report_type
    record.performance_score = performance_score

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
def delete_placement_record(id: int, db: Session = Depends(get_db)):
    record = db.query(Placement).filter(Placement.id == id).first()

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
    return db.query(Activity).filter(
        Activity.faculty_id == faculty_id,
        Activity.module == "placements"
    ).all()