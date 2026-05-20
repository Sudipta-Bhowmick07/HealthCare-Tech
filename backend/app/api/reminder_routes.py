from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.models.reminder_model import Reminder
from app.models.user import User

from app.schemas.reminder_schema import (
    ReminderCreate,
    ReminderResponse
)

from app.auth.security import get_current_user

router = APIRouter(
    tags=["Reminders"]
)


@router.post("/add")
def add_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_reminder = Reminder(
        medicine_name=reminder.medicine_name,
        dosage=reminder.dosage,
        frequency=reminder.frequency,
        reminder_time=reminder.reminder_time,
        user_id=current_user.id
    )

    db.add(new_reminder)

    db.commit()

    db.refresh(new_reminder)

    return {
        "message": "Reminder added successfully"
    }


@router.get(
    "/my-reminders",
    response_model=list[ReminderResponse]
)
def get_my_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id
    ).all()

    return reminders


@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    db.delete(reminder)

    db.commit()

    return {
        "message": "Reminder deleted"
    }