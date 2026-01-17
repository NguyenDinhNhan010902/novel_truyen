import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText

print("Loading .env file...")
load_dotenv()

username = os.getenv("MAIL_USERNAME")
password = os.getenv("MAIL_PASSWORD")

print(f"Username found: {'Yes' if username else 'No'} ({username})")
print(f"Password found: {'Yes' if password else 'No'} ({'******' if password else 'None'})")

if not username or not password:
    print("Error: Missing credentials in .env")
    exit(1)

if "your_email" in username:
    print("Error: Default placeholder values detected. Please update .env")
    exit(1)

print("Attempting to connect to Gmail SMTP...")
try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    print("TLS started. Logging in...")
    server.login(username, password)
    print("Login successful!")
    
    # Optional: Send test (uncomment to test actual delivery)
    # msg = MIMEText("Test email from debugging script")
    # msg['Subject'] = "Test Email"
    # msg['From'] = username
    # msg['To'] = username
    # server.sendmail(username, username, msg.as_string())
    # print("Test email sent to self.")
    
    server.quit()
    print("Connection closed.")
except Exception as e:
    print("SMTP Error occurred:")
    print(e)
