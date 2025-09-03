from sqlalchemy import Integer, String, Text, Boolean, DateTime, func, Column, Enum as sqlEnum
from enum import Enum
from .database import Base

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class StatusEnum(str, Enum):
    new = "new"
    scheduled = "scheduled"
    in_progress = "in_progress"
    completed = "completed"

def create_table(table_name: str):
    class Task(Base):
        __tablename__ = table_name
        __table_args__ = {'extend_existing': True}

        id = Column(Integer, primary_key=True, index=True)
        title = Column(String(255), nullable=False)
        description = Column(Text, nullable=True)
        status = Column(sqlEnum(StatusEnum), default=StatusEnum.new)
        due_date = Column(DateTime(timezone=True), nullable=True)
        priority = Column(sqlEnum(PriorityEnum), default=PriorityEnum.medium)
        created_on = Column(DateTime(timezone=True), server_default=func.now())
        updated_on = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    return Task