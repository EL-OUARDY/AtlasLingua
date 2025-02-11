from flask_jwt_extended import create_access_token, create_refresh_token
from app.models.user import User
from app import db, bcrypt
from app.services.email_service import EmailService
from app.services.firebase_service import FirebaseService
from app.utils.helpers import generate_password


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
        return EmailService.send_reset_email(
            recipient_name, recipient_email, reset_link
        )

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
