from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from app.database.db import Base


class Adherence(Base):

    __tablename__ = "adherence"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    reminder_id = Column(
        Integer,
        ForeignKey("reminders.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    status = Column(
        String
    )

    taken_at = Column(
        DateTime
    )