from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    Date
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Reminder(Base):

    __tablename__ = "reminders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    medicine_name = Column(
        String,
        nullable=False
    )

    dosage = Column(
        String,
        nullable=False
    )

    frequency = Column(
        String,
        nullable=False
    )

    # MULTIPLE TIMES
    reminder_times = Column(
        String,
        nullable=False
    )

    # DURATION
    start_date = Column(
        Date,
        nullable=False
    )

    end_date = Column(
        Date,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship("User")