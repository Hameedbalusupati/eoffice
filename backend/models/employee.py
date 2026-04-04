"""
models/employee.py

👉 Stores employee-related activities
👉 Matches your ECAP Employee module
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database.base import Base


class Employee(Base):
    __tablename__ = "employee"

    # =========================
    # 🔑 PRIMARY KEY
    # =========================
    id = Column(Integer, primary_key=True, index=True)

    # =========================
    # 👨‍🏫 FACULTY LINK
    # =========================
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # =========================
    # 📌 ACTIVITY NAME
    # =========================
    activity_name = Column(String(100), nullable=False)
    # Example:
    # additional_work, employee_search, search_report, staff_vs_courses

    # =========================
    # 📝 DETAILS
    # =========================
    description = Column(Text, nullable=True)

    # =========================
    # 🔍 SEARCH DETAILS
    # =========================
    search_query = Column(String(255), nullable=True)

    # =========================
    # 📊 REPORT DETAILS
    # =========================
    report_type = Column(String(100), nullable=True)

    # =========================
    # 👥 STAFF / COURSE DATA
    # =========================
    staff_name = Column(String(100), nullable=True)
    course_name = Column(String(100), nullable=True)

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
        return f"<Employee(activity={self.activity_name}, faculty_id={self.faculty_id})>"