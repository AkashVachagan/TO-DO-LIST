from sqlalchemy import Integer, String, Text, Boolean, DateTime, func, Column
from .database import Base

def create_table(table_name: str):
    class Task(Base):
        __tablename__ = table_name
        __table_args__ = {'extend_existing': True}
        id = Column(Integer, primary_key=True, index=True)
        title = Column(String(255), nullable=False)
        description = Column(Text, nullable=True)
        completed = Column(Boolean, default=False)
        created_on = Column(DateTime(timezone=True), server_default=func.now())
        updated_on = Column(DateTime(timezone=True), server_default=func.now())
        scheduled = Column(DateTime(timezone=True), nullable=True)
        is_scheduled = Column(Boolean, default=False)
    return Task