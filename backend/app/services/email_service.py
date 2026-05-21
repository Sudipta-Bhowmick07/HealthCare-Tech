import smtplib

from email.mime.text import MIMEText

from email.mime.multipart import MIMEMultipart


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL_ADDRESS = "sudiptabhowmick2004@gmail.com"
EMAIL_PASSWORD = "jkrt rafk zkzb nrpq"


def send_reminder_email(
    to_email,
    medicine_name,
    dosage,
    reminder_time
):

    try:

        subject = "💊 Medicine Reminder"

        body = f"""
Hello,

This is your medicine reminder.

Medicine: {medicine_name}

Dosage: {dosage}

Time: {reminder_time}

Please take your medicine on time.

- MedAssist AI
"""

        msg = MIMEMultipart()

        msg["From"] = EMAIL_ADDRESS

        msg["To"] = to_email

        msg["Subject"] = subject

        msg.attach(
            MIMEText(body, "plain")
        )

        server = smtplib.SMTP(
            SMTP_SERVER,
            SMTP_PORT
        )

        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_ADDRESS,
            to_email,
            msg.as_string()
        )

        server.quit()

        print(
            f"Reminder sent to {to_email}"
        )

    except Exception as e:

        print(
            "Email sending failed:",
            str(e)
        )