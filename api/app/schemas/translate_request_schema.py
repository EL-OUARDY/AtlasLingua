from marshmallow import validate
from app import ma
from app.utils.shared import LanguagesEnum


class TranslateRequestSchema(ma.Schema):
    text = ma.String(required=True, validate=validate.Length(min=1))
    source = ma.String(
        required=True,
        validate=validate.OneOf([lang.value for lang in LanguagesEnum]),
    )
    destination = ma.String(
        required=True,
        validate=validate.OneOf([lang.value for lang in LanguagesEnum]),
    )


translate_request_schema = TranslateRequestSchema()
