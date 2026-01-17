import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

def send_verification_email(email: str, code: str):
    """
    Send verification email using SMTP (Gmail).
    """
    if not MAIL_USERNAME or not MAIL_PASSWORD or "your_email" in MAIL_USERNAME:
        print("="*40)
        print(" [EMAIL SERVICE] SMTP Credentials not set in .env")
        print(f" [EMAIL SERVICE] To: {email}")
        print(f" [EMAIL SERVICE] Code: {code}")
        print("="*40)
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = MAIL_USERNAME
        msg['To'] = email
        msg['Subject'] = "Verification Code - NovelZone"

        body = f"Your verification code is: {code}\n\nThis code will expire in 10 minutes."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(MAIL_USERNAME, email, text)
        server.quit()
        print(f" [EMAIL SERVICE] Sent email to {email}")
        return True
    except Exception as e:
        print(f" [EMAIL SERVICE] Failed to send email: {e}")
        # Fallback to console print for dev
        print(f" [EMAIL SERVICE] Backup Code Display: {code}")
        return False

def send_reset_email(email: str, code: str):
    """
    Send password reset email using SMTP (Gmail).
    """
    if not MAIL_USERNAME or not MAIL_PASSWORD or "your_email" in MAIL_USERNAME:
        print("="*40)
        print(" [EMAIL SERVICE] SMTP Credentials not set in .env")
        print(f" [EMAIL SERVICE] To: {email}")
        print(f" [EMAIL SERVICE] Reset Code: {code}")
        print("="*40)
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = MAIL_USERNAME
        msg['To'] = email
        msg['Subject'] = "Reset Password Code - NovelZone"

        body = f"Your password reset code is: {code}\n\nThis code will expire in 10 minutes.\nIf you didn't request this, please ignore this email."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(MAIL_USERNAME, email, text)
        server.quit()
        print(f" [EMAIL SERVICE] Sent reset email to {email}")
        return True
    except Exception as e:
        print(f" [EMAIL SERVICE] Failed to send email: {e}")
        print(f" [EMAIL SERVICE] Backup Reset Code Display: {code}")
        return False
