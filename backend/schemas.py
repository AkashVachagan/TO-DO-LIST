from pydantic import BaseModel
from .models import StatusEnum, PriorityEnum
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: str | None = None

class TaskCreate(TaskBase):
    status: StatusEnum = StatusEnum.new
    priority: PriorityEnum = PriorityEnum.medium
    due_date: datetime | None = None

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