"""
models/academics.py

👉 Stores all academics-related activities
👉 Linked with faculty (user)
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database.base import Base


class Academics(Base):
    __tablename__ = "academics"

    # =========================
    # 🔑 PRIMARY KEY
    # =========================
    id = Column(Integer, primary_key=True, index=True)

    # =========================
    # 👨‍🏫 FACULTY LINK
    # =========================
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # =========================
    # 📌 ACTIVITY DETAILS
    # =========================
    activity_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    # =========================
    # 📚 OPTIONAL FIELDS
    # =========================
    subject = Column(String(100), nullable=True)
    class_name = Column(String(100), nullable=True)
    section = Column(String(50), nullable=True)

    # =========================
    # 📅 TIMESTAMPS
    # =========================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # =========================
    # 🔥 STATUS (OPTIONAL)
    # =========================
    status = Column(String(20), default="pending")  # pending / completed

    # =========================
    # 🔄 STRING REPRESENTATION
    # =========================
    def __repr__(self):
        return f"<Academics(activity={self.activity_name}, faculty_id={self.faculty_id})>"