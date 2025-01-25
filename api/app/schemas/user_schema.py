from marshmallow import ValidationError, validates, validate
from app import ma
from app.services.auth_service import AuthService


class UserSchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    email = ma.Email(required=True)
    name = ma.String(required=True, validate=validate.Length(min=2, max=64))
    password = ma.String(load_only=True, required=False)
    bio = ma.String(required=False)
    role = ma.String(required=False)
    avatar = ma.String(required=False)


class LoginSchema(ma.Schema):
    email = ma.Email(required=True)
    password = ma.String(load_only=True, required=True)

    @validates("email")
    def validate_email(self, value):
        if not AuthService.get_user_by_email(value):
            raise ValidationError("User does not exists.")


class RegisterSchema(ma.Schema):
    email = ma.Email(required=True)
    name = ma.String(required=True, validate=validate.Length(min=2, max=64))
    password = ma.String(
        load_only=True, required=True, validate=validate.Length(min=8)
    )

    @validates("email")
    def validate_email(self, value):
        if AuthService.get_user_by_email(value):
            raise ValidationError("Email already exists.")


user_schema = UserSchema()
users_schema = UserSchema(many=True)

login_schema = LoginSchema()
register_schema = RegisterSchema()
