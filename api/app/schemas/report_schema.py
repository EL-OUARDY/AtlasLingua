from marshmallow import validate
from app import ma


class ReportSchema(ma.Schema):
    body = ma.String(required=True, validate=validate.Length(min=1))
    translation_id = ma.Number(required=True)


report_schema = ReportSchema()
