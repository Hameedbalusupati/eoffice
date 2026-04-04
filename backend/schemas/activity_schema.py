"""
schemas/activity_schema.py

👉 Pydantic schemas for Activity
👉 Used for request validation & response formatting
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =========================
# 🔹 BASE SCHEMA
# =========================
class ActivityBase(BaseModel):
    faculty_id: int
    module: str
    activity_name: str


# =========================
# 🔹 CREATE SCHEMA (INPUT)
# =========================
class ActivityCreate(ActivityBase):
    status: Optional[bool] = False


# =========================
# 🔹 UPDATE SCHEMA
# =========================
class ActivityUpdate(BaseModel):
    status: Optional[bool] = None


# =========================
# 🔹 RESPONSE SCHEMA (OUTPUT)
# =========================
class ActivityResponse(ActivityBase):
    id: int
    status: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # for SQLAlchemy compatibility


# =========================
# 🔹 BULK RESPONSE (LIST)
# =========================
class ActivityListResponse(BaseModel):
    activities: list[ActivityResponse]