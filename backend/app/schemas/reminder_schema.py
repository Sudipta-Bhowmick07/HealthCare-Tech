from pydantic import BaseModel

from datetime import date


class ReminderCreate(BaseModel):

    medicine_name: str

    dosage: str

    frequency: str

    reminder_times: list[str]

    duration_days: int


class ReminderResponse(BaseModel):

    id: int

    medicine_name: str

    dosage: str

    frequency: str

    reminder_times: str

    start_date: date

    end_date: date

    is_active: bool

    class Config:

        from_attributes = True