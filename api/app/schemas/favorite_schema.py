from marshmallow import validate
from app import ma


class FavoriteSchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    arabic = ma.String(required=False)
    verified = ma.Boolean(required=False)
    word_type = ma.String(required=False)
    created_at = ma.String(dump_only=True)
    user_id = ma.Number(dump_only=True)


favorite_schema = FavoriteSchema()
favorites_schema = FavoriteSchema(many=True)
