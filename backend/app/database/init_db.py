from app.database.db import engine, Base

from app.models.user import User

from app.models.prescription import Prescription

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")