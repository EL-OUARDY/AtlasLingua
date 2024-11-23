from flask_jwt_extended import create_access_token, create_refresh_token
from app.models.user import User
from app import db, bcrypt
from app.utils.helpers import generate_password


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
