from marshmallow import validate
from app import ma


class FeedbackSchema(ma.Schema):
    subject = ma.String(required=True, validate=validate.Length(min=1))
    body = ma.String(required=True, validate=validate.Length(min=1))


feedback_schema = FeedbackSchema()
