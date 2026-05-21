from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from datetime import datetime

from app.database.db import SessionLocal

from app.models.adherence_model import Adherence

from app.models.user import User

from app.auth.security import get_current_user


router = APIRouter(
    prefix="/adherence",
    tags=["Adherence"]
)


# DATABASE


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# ==========================
# MARK TAKEN
# ==========================

@router.post("/taken/{reminder_id}")

def mark_taken(

    reminder_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )

):

    adherence = Adherence(

        reminder_id=reminder_id,

        user_id=current_user.id,

        status="Taken",

        taken_at=datetime.now()

    )

    db.add(adherence)

    db.commit()

    return {

        "message": "Medicine marked as taken"

    }


# ==========================
# MARK MISSED
# ==========================

@router.post("/missed/{reminder_id}")

def mark_missed(

    reminder_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )

):

    adherence = Adherence(

        reminder_id=reminder_id,

        user_id=current_user.id,

        status="Missed",

        taken_at=datetime.now()

    )

    db.add(adherence)

    db.commit()

    return {

        "message": "Medicine marked as missed"

    }


# ==========================
# GET HISTORY
# ==========================

@router.get("/history/{reminder_id}")

def get_history(

    reminder_id: int,

    db: Session = Depends(get_db)

):

    history = db.query(
        Adherence
    ).filter(
        Adherence.reminder_id == reminder_id
    ).all()

    return history

# ==========================
# ANALYTICS
# ==========================

@router.get("/analytics")
def adherence_analytics(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    total_taken = db.query(
        Adherence
    ).filter(
        Adherence.user_id == current_user.id,
        Adherence.status == "Taken"
    ).count()

    total_missed = db.query(
        Adherence
    ).filter(
        Adherence.user_id == current_user.id,
        Adherence.status == "Missed"
    ).count()

    total = total_taken + total_missed

    adherence_rate = 0

    if total > 0:

        adherence_rate = round(
            (total_taken / total) * 100,
            2
        )

    return {

        "total_taken": total_taken,

        "total_missed": total_missed,

        "adherence_rate": adherence_rate

    }