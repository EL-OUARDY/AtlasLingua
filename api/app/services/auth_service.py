from flask_jwt_extended import create_access_token, create_refresh_token
from app.models.user import User
from app import db, bcrypt
from app.utils.helpers import generate_password
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class AuthService:
    @staticmethod
    def register_user(name, email, password):
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
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
            user.name = user_info["name"]
            user.avatar = user_info["picture"]
            # Other updates

        db.session.commit()
        return user

    @staticmethod
    def send_password_reset_email(recipient_email, reset_link):

        sender_email = "AtlasLingua <noreply@atlaslingua.com>"

        # Email HTML content
        html_content = f"""
        <html>
        <body style="font-family: Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <div style="background-color: #0369a1; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">AtlasLingua</h1>
                </div>

                <!-- Body -->
                <div style="padding: 20px; background-color: #f9f9f9;">
                    <p>Hi,</p>
                    <p>We received a request to reset your password. If this was you, click the button below to reset your
                        password:</p>
                    <a href="{reset_link}" style="
                                display: inline-block;
                                padding: 10px 20px;
                                color: white;
                                background-color: #0369a1;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                            ">Reset Your Password</a>
                    <p>If you didn't request this, you can safely ignore this email. Your password won't be changed.</p>
                </div>

                <!-- Footer -->
                <div style="padding: 10px; text-align: center; background-color: #f1f1f1; color: #555; font-size: 12px;">
                    <p>© AtlasLingua — All rights reserved.</p>
                    <p><a href="{os.getenv('FRONTEND_URL')}" style="color: #0369a1; text-decoration: none;">Visit Our Website</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

        # Create the email
        message = MIMEMultipart("alternative")
        message["From"] = sender_email
        message["To"] = recipient_email
        message["Subject"] = "Password Reset"

        # Attach the HTML content
        html_part = MIMEText(html_content, "html", "utf-8")
        message.attach(html_part)

        try:
            # Connect to the SMTP server
            with smtplib.SMTP(
                os.getenv("MAIL_SERVER"), os.getenv("MAIL_PORT")
            ) as server:
                server.starttls()  # Secure the connection
                server.login(
                    os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD")
                )
                server.sendmail(
                    sender_email,
                    recipient_email,
                    message.as_string().encode("utf-8"),
                )
        except Exception as e:
            print(f"An error occurred: {e}")

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
