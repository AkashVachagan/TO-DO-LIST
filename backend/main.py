from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import Base, engine, sessionLocal
from .models import create_table, PriorityEnum, StatusEnum

app = FastAPI()

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

@app.get("/tasks/")
def get_tasks(status: StatusEnum = None, db: Session = Depends(get_db)):
    query = db.query(TASKS)
    if status:
        query = query.filter(TASKS.status == status)
    return query.all()

@app.post("/tasks/")
def create_task(title: str, description: str = None, db : Session = Depends(get_db)):
    task = TASKS(title=title, description=description)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.patch("/tasks/{task_id}/status")
def update_task(task_id: int, status: StatusEnum, db: Session = Depends(get_db)):
    task = db.query(TASKS).filter(TASKS.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    task.status = status
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TASKS).filter(TASKS.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task successfully deleted"}