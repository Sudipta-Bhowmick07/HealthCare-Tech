from pydantic import BaseModel


class ReminderCreate(BaseModel):
    medicine_name: str
    dosage: str
    frequency: str
    reminder_time: str


class ReminderResponse(BaseModel):
    id: int
    medicine_name: str
    dosage: str
    frequency: str
    reminder_time: str

    class Config:
        from_attributes = True