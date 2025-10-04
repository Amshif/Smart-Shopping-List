import logging
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import HTTPException, status
import smtplib
from app.shared.dependencies import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_booking_email(to_email: str, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype="html"   # can also be "plain"
    )
    fm = FastMail(conf)

    try:
        await fm.send_message(message)
        logger.info(f"📧 Email sent successfully to {to_email} with subject: {subject}")
        return {"status": "success", "message": f"Email sent to {to_email}"}

    except smtplib.SMTPAuthenticationError as e:
        logger.error("❌ SMTP authentication failed: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email authentication failed. Please check credentials."
        )

    except smtplib.SMTPConnectError as e:
        logger.error("❌ SMTP connection error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the mail server."
        )

    except smtplib.SMTPRecipientsRefused:
        logger.warning(f"⚠️ Invalid recipient email: {to_email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid recipient address: {to_email}"
        )

    except Exception as e:
        logger.exception("❌ Unexpected error while sending email")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )
