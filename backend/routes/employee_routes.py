"""
routes/employee_routes.py

👉 Handles Employee module APIs
👉 Covers:
   - Additional Work
   - Search
   - Search Report
   - Staff vs Courses
👉 Integrated with activity tracking ✔️❌
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.employee import Employee
from models.activity import Activity
from services.activity_service import update_activity
from constants.activities import is_valid_activity

router = APIRouter(prefix="/employee", tags=["Employee"])


# =========================
# ✅ CREATE / PERFORM ACTION
# =========================
@router.post("/create")
def create_employee_activity(
    faculty_id: int,
    activity_name: str,
    description: str = "",
    search_query: str = "",
    report_type: str = "",
    staff_name: str = "",
    course_name: str = "",
    db: Session = Depends(get_db)
):
    # 🔍 Validate activity
    if not is_valid_activity("employee", activity_name):
        raise HTTPException(status_code=400, detail="Invalid activity")

    new_entry = Employee(
        faculty_id=faculty_id,
        activity_name=activity_name,
        description=description,
        search_query=search_query,
        report_type=report_type,
        staff_name=staff_name,
        course_name=course_name,
        status="completed"
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # 🔥 Update ✔️ status
    update_activity(
        db,
        faculty_id=faculty_id,
        module="employee",
        activity_name=activity_name
    )

    return {
        "message": "Employee activity completed",
        "data": new_entry
    }


# =========================
# 📄 GET ALL RECORDS
# =========================
@router.get("/")
def get_all_employee_records(db: Session = Depends(get_db)):
    records = db.query(Employee).all()
    return records


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    records = db.query(Employee).filter(
        Employee.faculty_id == faculty_id
    ).all()

    return records


# =========================
# 🔍 GET BY ACTIVITY TYPE
# =========================
@router.get("/faculty/{faculty_id}/{activity_name}")
def get_by_activity(
    faculty_id: int,
    activity_name: str,
    db: Session = Depends(get_db)
):
    records = db.query(Employee).filter(
        Employee.faculty_id == faculty_id,
        Employee.activity_name == activity_name
    ).all()

    return records


# =========================
# ✏️ UPDATE RECORD
# =========================
@router.put("/update/{id}")
def update_employee_record(
    id: int,
    description: str = "",
    search_query: str = "",
    report_type: str = "",
    db: Session = Depends(get_db)
):
    record = db.query(Employee).filter(Employee.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.description = description
    record.search_query = search_query
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
def delete_employee_record(id: int, db: Session = Depends(get_db)):
    record = db.query(Employee).filter(Employee.id == id).first()

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
        Activity.module == "employee"
    ).all()

    return status_data