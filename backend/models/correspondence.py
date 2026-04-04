"""
models/correspondence.py

👉 Stores all correspondence-related data
👉 Covers SMS, inbox, complaints, greetings, etc.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database.base import Base


class Correspondence(Base):
    __tablename__ = "correspondence"

    # =========================
    # 🔑 PRIMARY KEY
    # =========================
    id = Column(Integer, primary_key=True, index=True)

    # =========================
    # 👨‍🏫 FACULTY (USER) LINK
    # =========================
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # =========================
    # 📌 ACTIVITY TYPE
    # =========================
    activity_name = Column(String(100), nullable=False)
    # Example:
    # complaint_suggestion, inbox, sms_staff, greetings

    # =========================
    # 📩 MESSAGE DETAILS
    # =========================
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)

    # =========================
    # 👥 RECEIVER DETAILS
    # =========================
    receiver_type = Column(String(50), nullable=True)
    # Example: student, parent, staff

    receiver_id = Column(Integer, nullable=True)

    # =========================
    # 📱 SMS TYPE (OPTIONAL)
    # =========================
    sms_type = Column(String(100), nullable=True)
    # Example:
    # exam_attendance, marks_attendance, parent_student, staff

    # =========================
    # 📊 STATUS
    # =========================
    status = Column(String(20), default="pending")
    # pending / sent / read

    # =========================
    # 📅 TIMESTAMPS
    # =========================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # =========================
    # 🔄 STRING REPRESENTATION
    # =========================
    def __repr__(self):
        return f"<Correspondence(activity={self.activity_name}, faculty_id={self.faculty_id})>"