from flask_jwt_extended import create_access_token, create_refresh_token
from flask_mail import Message
from app.models.user import User
from app import db, bcrypt, mail
from app.utils.helpers import generate_password
import os


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
                password=bcrypt.generate_password_hash(
                    generate_password()
                ).decode("utf-8"),
                # Other necessary fields
            )
            db.session.add(user)
        else:
            # Update existing user details
            user.name = user_info["name"]
            # Other updates

        db.session.commit()
        return user

    @staticmethod
    def send_password_reset_email(email, reset_link):
        try:
            msg = Message(
                f"{os.getenv('APP_NAME')} | Password Reset Request",
                recipients=[email],
            )

            msg.body = f"Click the link to reset your password: {reset_link}"

            msg.html = f"""
            <html>
            <body style="font-family: Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <div style="background-color: #0369a1; padding: 20px; text-align: center; color: white;">
                        <img src="{os.getenv('FRONTEND_URL')}/logo.svg" alt="Site Logo" style="width: 50px; margin-bottom: 10px;">
                        <h1 style="margin: 0; font-size: 24px;">AtlasLingua</h1>
                    </div>

                    <!-- Body -->
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <h2 style="color: #333;">Password Reset Request</h2>
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

            mail.send(msg)

        except Exception as e:
            print(f"Failed to send email: {str(e)}")

    @staticmethod
    def update_user_password(user, new_password):
        user.set_password(new_password)
        db.session.commit()
