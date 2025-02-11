from flask_jwt_extended import create_access_token, create_refresh_token
from app.models.user import User
from app import db, bcrypt
from app.services.firebase_service import FirebaseService
from app.utils.helpers import generate_password
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, To


class AuthService:
    @staticmethod
    def register_user(name, email, password):
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        # Save user to Firebase
        FirebaseService.set_user(user)
        return user

    @staticmethod
    def login_user(email, password):
        user = AuthService.get_user_by_email(email)
        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return access_token, refresh_token
        return None, None

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def process_google_user(user_info):
        user = User.query.filter_by(email=user_info["email"]).first()
        if not user:
            user = User(
                name=user_info["name"],
                email=user_info["email"],
                avatar=user_info["picture"],
                # Other necessary fields
                password=bcrypt.generate_password_hash(
                    generate_password()
                ).decode("utf-8"),
            )
            db.session.add(user)
        else:
            # Update existing user details
            user.avatar = user_info["picture"]
            # Other updates

        db.session.commit()
        # Save user to Firebase
        FirebaseService.set_user(user)
        return user

    @staticmethod
    def send_password_reset_email(recipient_name, recipient_email, reset_link):
        sender_email = os.getenv("MAIL_SENDER_EMAIL")
        template_id = os.getenv("MAIL_SENDGRID_RESET_PASSWORD_TEMPLATE_ID")

        message = Mail(
            from_email=From(sender_email, os.getenv("APP_NAME")),
            to_emails=To(recipient_email),
        )
        message.dynamic_template_data = {
            "subject": "Password reset requested",
            "recipient_name": recipient_name,
            "reset_link": reset_link,
        }
        message.template_id = template_id

        try:
            sg = SendGridAPIClient(os.getenv("MAIL_SENDGRID_API_KEY"))
            response = sg.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    @staticmethod
    def update_user_password(user, new_password):
        user.set_password(new_password)
        db.session.commit()

    @staticmethod
    def update_user(user, data):
        user.name = data["name"]
        user.email = data["email"]
        user.bio = data["bio"]
        if data.get("password"):
            user.set_password(data["password"])
        # avatar
        db.session.commit()
        # Save user to Firebase
        FirebaseService.set_user(user, update=True)
