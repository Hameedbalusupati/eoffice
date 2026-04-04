"""
models/placements.py

👉 Stores all placement-related activities
👉 Covers companies, internships, offers, reports, performance
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database.base import Base


class Placement(Base):
    __tablename__ = "placements"

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
    # Examples:
    # companies, internship_report, internship_details,
    # offers, placement_report, student_performance

    # =========================
    # 🏢 COMPANY DETAILS
    # =========================
    company_name = Column(String(255), nullable=True)
    company_location = Column(String(255), nullable=True)

    # =========================
    # 🎓 STUDENT DETAILS
    # =========================
    student_name = Column(String(255), nullable=True)
    student_roll_no = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)

    # =========================
    # 📊 INTERNSHIP DETAILS
    # =========================
    internship_title = Column(String(255), nullable=True)
    internship_status = Column(String(50), nullable=True)  # ongoing/completed
    internship_duration = Column(String(100), nullable=True)

    # =========================
    # 💼 OFFER DETAILS
    # =========================
    offer_role = Column(String(255), nullable=True)
    offer_salary = Column(String(100), nullable=True)
    offer_status = Column(String(50), nullable=True)  # selected/rejected

    # =========================
    # 📊 REPORT TYPE
    # =========================
    report_type = Column(String(100), nullable=True)

    # =========================
    # 📈 PERFORMANCE
    # =========================
    performance_score = Column(String(50), nullable=True)

    # =========================
    # 📝 DESCRIPTION
    # =========================
    description = Column(Text, nullable=True)

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
        return f"<Placement(activity={self.activity_name}, faculty_id={self.faculty_id})>"