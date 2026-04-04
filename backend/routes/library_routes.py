"""
routes/library_routes.py

👉 Handles Library module APIs
👉 Covers:
   - Back Volumes
   - BarChart
   - Book Status
   - Journals
   - OPAC
   - Reports
   - Search
   - Subscription
👉 Integrated with activity tracking ✔️❌
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.library import Library
from models.activity import Activity
from services.activity_service import update_activity
from constants.activities import is_valid_activity

router = APIRouter(prefix="/library", tags=["Library"])


# =========================
# ✅ CREATE / PERFORM ACTION
# =========================
@router.post("/create")
def create_library_activity(
    faculty_id: int,
    activity_name: str,
    description: str = "",
    book_title: str = "",
    author: str = "",
    department: str = "",
    search_query: str = "",
    report_type: str = "",
    subscription_name: str = "",
    subscription_status: str = "",
    db: Session = Depends(get_db)
):
    # 🔍 Validate activity
    if not is_valid_activity("library", activity_name):
        raise HTTPException(status_code=400, detail="Invalid activity")

    new_entry = Library(
        faculty_id=faculty_id,
        activity_name=activity_name,
        description=description,
        book_title=book_title,
        author=author,
        department=department,
        search_query=search_query,
        report_type=report_type,
        subscription_name=subscription_name,
        subscription_status=subscription_status,
        status="completed"
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    # 🔥 Update ✔️ status
    update_activity(
        db,
        faculty_id=faculty_id,
        module="library",
        activity_name=activity_name
    )

    return {
        "message": "Library activity completed",
        "data": new_entry
    }


# =========================
# 📄 GET ALL RECORDS
# =========================
@router.get("/")
def get_all_library(db: Session = Depends(get_db)):
    return db.query(Library).all()


# =========================
# 👨‍🏫 GET BY FACULTY
# =========================
@router.get("/faculty/{faculty_id}")
def get_by_faculty(faculty_id: int, db: Session = Depends(get_db)):
    return db.query(Library).filter(
        Library.faculty_id == faculty_id
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
    return db.query(Library).filter(
        Library.faculty_id == faculty_id,
        Library.activity_name == activity_name
    ).all()


# =========================
# ✏️ UPDATE RECORD
# =========================
@router.put("/update/{id}")
def update_library_record(
    id: int,
    description: str = "",
    book_title: str = "",
    author: str = "",
    department: str = "",
    report_type: str = "",
    db: Session = Depends(get_db)
):
    record = db.query(Library).filter(Library.id == id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.description = description
    record.book_title = book_title
    record.author = author
    record.department = department
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
def delete_library_record(id: int, db: Session = Depends(get_db)):
    record = db.query(Library).filter(Library.id == id).first()

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
        Activity.module == "library"
    ).all()