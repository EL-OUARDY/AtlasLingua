from flask import abort
from flask_jwt_extended import get_jwt_identity, jwt_required
from app import ma
from app.models.favorite import Favorite
from app.schemas.favorite_schema import favorite_schema


class DictionarySchema(ma.Schema):
    id = ma.Integer(dump_only=True)
    darija = ma.String(required=True)
    english = ma.String(required=True)
    arabic = ma.String(required=True)
    word_type = ma.String(required=False)
    category = ma.String(required=False)
    verified = ma.Boolean(required=True)

    favorite = ma.Method("is_favorite")

    @jwt_required(optional=True)
    def is_favorite(self, obj):
        user_id = get_jwt_identity()
        if not user_id:
            return False

        favorite = Favorite.query.filter(
            Favorite.user_id == user_id,
            Favorite.dictionary_id == obj.id,
        ).first()

        return favorite is not None


dictionary_schema = DictionarySchema()
dictionaries_schema = DictionarySchema(many=True)
