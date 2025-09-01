from fastapi import FastAPI
from .database import Base, engine
from . import models

app = FastAPI()

TASKS = models.create_table("tasks")

Base.metadata.create_all(bind=engine)

@app.get('/')
def read_root():
    return {"message": "TODO API is running"}