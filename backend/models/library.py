"""
models/library.py

👉 Stores all library-related activities
👉 Covers reports, OPAC, search, subscriptions, etc.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database.base import Base


class Library(Base):
    __tablename__ = "library"

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
    # back_volumes, barchart, book_status, journals, opac
    # best_user, books_list, department_library, new_arrivals

    # =========================
    # 📚 BOOK DETAILS
    # =========================
    book_title = Column(String(255), nullable=True)
    author = Column(String(255), nullable=True)
    department = Column(String(100), nullable=True)

    # =========================
    # 🔍 SEARCH / OPAC
    # =========================
    search_query = Column(String(255), nullable=True)

    # =========================
    # 📊 REPORT TYPE
    # =========================
    report_type = Column(String(100), nullable=True)

    # =========================
    # 📦 SUBSCRIPTION
    # =========================
    subscription_name = Column(String(100), nullable=True)
    subscription_status = Column(String(50), nullable=True)

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
        return f"<Library(activity={self.activity_name}, faculty_id={self.faculty_id})>"