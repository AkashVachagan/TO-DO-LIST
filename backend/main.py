from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from . import schemas, models
from .database import Base, engine, sessionLocal
from .models import create_table, PriorityEnum, StatusEnum
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TASKS = create_table("tasks")

Base.metadata.create_all(bind=engine)

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "TODO API is running"}

@app.get("/tasks/", response_model=list[schemas.TaskRead])
def get_tasks(status: StatusEnum = None, priority: PriorityEnum = None, db: Session = Depends(get_db)):
    query = db.query(TASKS).order_by(TASKS.id) # Added ordering for consistency
    if status:
        query = query.filter(TASKS.status == status)
    if priority:
        query = query.filter(TASKS.priority == priority)
    return query.all()

@app.post("/tasks/", response_model=schemas.TaskRead)
def create_task(task: schemas.TaskCreate, db : Session = Depends(get_db)):
    task_db = TASKS(title=task.title, description=task.description, status=task.status, priority=task.priority, due_date=task.due_date)
    db.add(task_db)
    db.commit()
    db.refresh(task_db)
    return task_db
    
# --- NEW ENDPOINT TO FIX THE UPDATE FUNCTIONALITY ---
@app.put("/tasks/{task_id}", response_model=schemas.TaskRead)
def update_task_details(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task_db = db.query(TASKS).filter(TASKS.id == task_id).first()
    if not task_db:
        raise HTTPException(status_code=404, detail="Task not found")

    # Get the update data from the request, excluding any fields that were not set
    update_data = task_update.model_dump(exclude_unset=True)

    # Update the task_db object with the new data
    for key, value in update_data.items():
        setattr(task_db, key, value)
    
    db.commit()
    db.refresh(task_db)
    return task_db
# --- END OF NEW ENDPOINT ---

@app.patch("/tasks/{task_id}", response_model=schemas.TaskRead) # Changed from @app.put
def update_task_details(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task_db = db.query(TASKS).filter(TASKS.id == task_id).first()
    if not task_db:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task_db, key, value)
    
    db.commit()
    db.refresh(task_db)
    return task_db

@app.patch("/tasks/{task_id}/status", response_model=schemas.TaskRead)
def update_task_status(task_id: int, task: schemas.TaskUpdateStatus, db: Session = Depends(get_db)):
    task_db = db.query(TASKS).filter(TASKS.id == task_id).first()
    if not task_db:
        raise HTTPException(status_code=404, detail="task not found")
    task_db.status = task.status
    db.commit()
    db.refresh(task_db)
    return task_db

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TASKS).filter(TASKS.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task successfully deleted"}

# This is a dangerous endpoint, use with caution.
# I'm leaving it since it was in your original code.
@app.delete("/tasks/all")
def delete_all_tasks(db: Session = Depends(get_db)):
    deleted_count = db.query(TASKS).delete()
    db.commit()
    return {"message": f"Successfully deleted {deleted_count} tasks"}