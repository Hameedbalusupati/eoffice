"""
models/user.py

👉 Handles user registration & login
👉 Supports role-based system (employee / student / admin)
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.base import Base


class User(Base):
    __tablename__ = "users"

    # =========================
    # 🔑 PRIMARY KEY
    # =========================
    id = Column(Integer, primary_key=True, index=True)

    # =========================
    # 👤 BASIC INFO
    # =========================
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    # =========================
    # 🎭 ROLE (IMPORTANT)
    # =========================
    role = Column(String(50), default="employee")
    # employee / student / admin

    # =========================
    # 📞 OPTIONAL FIELDS
    # =========================
    phone = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)

    # =========================
    # 📊 STATUS
    # =========================
    is_active = Column(Boolean, default=True)

    # =========================
    # 📅 TIMESTAMPS
    # =========================
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # =========================
    # 🔗 RELATIONSHIP
    # =========================
    activities = relationship("Activity", back_populates="user", cascade="all, delete")

    # =========================
    # 🔄 STRING REPRESENTATION
    # =========================
    def __repr__(self):
        return f"<User(email={self.email}, role={self.role})>"