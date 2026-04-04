from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database.base import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)

    faculty_id = Column(Integer, ForeignKey("users.id"))

    module = Column(String, nullable=False)
    activity_name = Column(String, nullable=False)

    status = Column(Boolean, default=False)

    user = relationship("User", back_populates="activities")