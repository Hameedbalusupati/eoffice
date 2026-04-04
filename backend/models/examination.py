"""
models/examination.py

👉 Stores all examination-related activities
👉 Covers External + Internal modules
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database.base import Base


class Examination(Base):
    __tablename__ = "examinations"

    # =========================
    # 🔑 PRIMARY KEY
    # =========================
    id = Column(Integer, primary_key=True, index=True)

    # =========================
    # 👨‍🏫 FACULTY LINK
    # =========================
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # =========================
    # 📌 MODULE TYPE
    # =========================
    module_type = Column(String(50), nullable=False)
    # Example: external / internal

    # =========================
    # 📌 ACTIVITY NAME
    # =========================
    activity_name = Column(String(100), nullable=False)
    # Example:
    # external_time_table, external_marks_upload, internal_analysis

    # =========================
    # 📝 DETAILS
    # =========================
    description = Column(Text, nullable=True)

    # =========================
    # 📚 EXAM DETAILS
    # =========================
    exam_name = Column(String(100), nullable=True)
    subject = Column(String(100), nullable=True)
    class_name = Column(String(100), nullable=True)

    # =========================
    # 📊 REPORT TYPE
    # =========================
    report_type = Column(String(100), nullable=True)

    # =========================
    # 👥 INVIGILATION / SEATING
    # =========================
    hall_number = Column(String(50), nullable=True)
    duty_details = Column(Text, nullable=True)

    # =========================
    # 📊 STATUS
    # =========================
    status = Column(String(20), default="pending")
    # pending / completed

    # =========================
    # 📅 TIMESTAMPS
    # =========================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # =========================
    # 🔄 STRING REPRESENTATION
    # =========================
    def __repr__(self):
        return f"<Examination(activity={self.activity_name}, faculty_id={self.faculty_id})>"