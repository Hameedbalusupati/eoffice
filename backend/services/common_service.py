"""
services/common_service.py

👉 Common reusable service functions
👉 Used across all modules (Academics, Employee, etc.)
👉 Reduces duplicate code
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError


# =========================
# ✅ CREATE RECORD
# =========================
def create_record(db: Session, model, data: dict):
    """
    Generic create function
    """
    try:
        new_record = model(**data)
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record
    except SQLAlchemyError as e:
        db.rollback()
        raise e


# =========================
# 📄 GET ALL RECORDS
# =========================
def get_all_records(db: Session, model):
    return db.query(model).all()


# =========================
# 👨‍🏫 GET BY ID
# =========================
def get_by_id(db: Session, model, record_id: int):
    return db.query(model).filter(model.id == record_id).first()


# =========================
# 🔍 FILTER RECORDS
# =========================
def filter_records(db: Session, model, filters: dict):
    query = db.query(model)

    for key, value in filters.items():
        if hasattr(model, key) and value is not None:
            query = query.filter(getattr(model, key) == value)

    return query.all()


# =========================
# ✏️ UPDATE RECORD
# =========================
def update_record(db: Session, model, record_id: int, update_data: dict):
    record = db.query(model).filter(model.id == record_id).first()

    if not record:
        return None

    try:
        for key, value in update_data.items():
            if hasattr(record, key) and value is not None:
                setattr(record, key, value)

        db.commit()
        db.refresh(record)
        return record
    except SQLAlchemyError as e:
        db.rollback()
        raise e


# =========================
# ❌ DELETE RECORD
# =========================
def delete_record(db: Session, model, record_id: int):
    record = db.query(model).filter(model.id == record_id).first()

    if not record:
        return False

    try:
        db.delete(record)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise e


# =========================
# 📊 PAGINATION
# =========================
def paginate_records(db: Session, model, page: int = 1, limit: int = 10):
    """
    Returns paginated data
    """
    offset = (page - 1) * limit

    query = db.query(model)
    total = query.count()

    data = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": data
    }


# =========================
# 🔍 SEARCH (LIKE)
# =========================
def search_records(db: Session, model, field: str, keyword: str):
    """
    Search using LIKE
    """
    if not hasattr(model, field):
        return []

    return db.query(model).filter(
        getattr(model, field).ilike(f"%{keyword}%")
    ).all()


# =========================
# 🔄 BULK CREATE
# =========================
def bulk_create(db: Session, model, data_list: list):
    """
    Insert multiple records
    """
    try:
        objects = [model(**data) for data in data_list]
        db.add_all(objects)
        db.commit()
        return objects
    except SQLAlchemyError as e:
        db.rollback()
        raise e


# =========================
# 📊 STANDARD RESPONSE FORMAT
# =========================
def success_response(message: str, data=None):
    return {
        "status": "success",
        "message": message,
        "data": data
    }


def error_response(message: str):
    return {
        "status": "error",
        "message": message
    }