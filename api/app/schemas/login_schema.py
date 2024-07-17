from marshmallow import ValidationError, validates, validate
from app import ma
from app.services.auth_service import AuthService


class LoginSchema(ma.Schema):
    email = ma.Email(required=True)
    password = ma.String(load_only=True, required=True)

    @validates("email")
    def validate_email(self, value):
        if not AuthService.get_user_by_email(value):
            raise ValidationError("User does not exists.")


login_schema = LoginSchema()
