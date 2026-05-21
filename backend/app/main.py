from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.models.reminder_model import Reminder

from app.api import ocr_routes
from app.api import auth_routes

from app.database.db import engine, Base

from app.api import reminder_routes

from app.api import adherence_routes

from app.models.adherence_model import Adherence

from app.api import pharmacy_routes

from app.services.reminder_scheduler import (
    start_scheduler
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

start_scheduler()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    ocr_routes.router
)

app.include_router(
    auth_routes.router
)

app.include_router(
    reminder_routes.router
)

app.include_router(
    pharmacy_routes.router
)


app.include_router(
    adherence_routes.router
)

@app.get("/")
def root():
    return {
        "message": "MedAssist AI Backend Running"
    }