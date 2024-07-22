from marshmallow import validate
from app import ma


class ContributionSchema(ma.Schema):
    contribution_type = ma.String(
        required=True, validate=validate.Length(min=1)
    )
    description = ma.String(required=True, validate=validate.Length(min=1))
    links = ma.String(required=False)


contribution_schema = ContributionSchema()
