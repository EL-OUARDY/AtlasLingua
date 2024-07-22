from marshmallow import validate
from app import ma


class ContactSchema(ma.Schema):
    name = ma.String(required=True, validate=validate.Length(min=2, max=64))
    email = ma.Email(required=True)
    subject = ma.String(required=True, validate=validate.Length(min=1))
    message = ma.String(required=True, validate=validate.Length(min=1))


contact_schema = ContactSchema()
