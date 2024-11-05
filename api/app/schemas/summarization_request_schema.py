from marshmallow import validate
from app import ma
from app.utils.shared import LanguagesEnum


class SummarizationRequestSchema(ma.Schema):
    text = ma.String(required=True, validate=validate.Length(min=1))


summarization_request_schema = SummarizationRequestSchema()
