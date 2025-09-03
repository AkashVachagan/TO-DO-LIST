from pydantic import BaseModel
from .models import StatusEnum, PriorityEnum
from datetime import datetime
from typing import Optional # Import Optional for the new class

class TaskBase(BaseModel):
    title: str
    description: str | None = None

class TaskCreate(TaskBase):
    status: StatusEnum = StatusEnum.new
    priority: PriorityEnum = PriorityEnum.medium
    due_date: datetime | None = None

# --- ADD THIS NEW CLASS ---
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True
# --- END OF NEW CLASS ---

class TaskUpdateStatus(BaseModel):
    status: StatusEnum

class TaskRead(TaskBase):
    id: int
    status: StatusEnum
    priority: PriorityEnum
    due_date: datetime | None = None
    created_on: datetime
    updated_on: datetime

    class Config:
        from_attributes = True