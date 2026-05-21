from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from datetime import datetime

from sqlalchemy.orm import Session

from app.database.db import SessionLocal

from app.models.reminder_model import Reminder

from app.models.user import User

from app.services.email_service import (
    send_reminder_email
)

scheduler = BackgroundScheduler()


def check_reminders():

    db: Session = SessionLocal()

    try:

        current_time = datetime.now().strftime(
            "%H:%M"
        )

        current_date = datetime.now().date()

        reminders = db.query(Reminder).all()

        for reminder in reminders:

            # Skip expired reminders
            if reminder.end_date < current_date:
                continue

            # Multiple reminder times
            reminder_times = reminder.reminder_times.split(",")

            for reminder_time in reminder_times:

                if reminder_time.strip() == current_time:

                    user = db.query(User).filter(
                        User.id == reminder.user_id
                    ).first()

                    if user:

                        send_reminder_email(
                            user.email,
                            reminder.medicine_name,
                            reminder.dosage,
                            reminder_time
                        )

                        print(
                            f"Reminder sent for "
                            f"{reminder.medicine_name} "
                            f"at {reminder_time}"
                        )

    except Exception as e:

        print(
            "Reminder scheduler error:",
            str(e)
        )

    finally:

        db.close()


def start_scheduler():

    scheduler.add_job(
        check_reminders,
        "interval",
        minutes=1
    )

    scheduler.start()

    print("Reminder scheduler started")