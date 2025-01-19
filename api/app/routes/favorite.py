from flask import Blueprint, abort, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.schemas.favorite_schema import (
    favorite_schema,
    paginated_favorites_schema,
)
from app.services.favorite_service import FavoriteService


bp = Blueprint("favorite", __name__, url_prefix="/api/favorite")


@bp.route("/list", methods=["POST"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    search = request.json.get("search", None)
    page = request.json.get("page", 1)
    per_page = request.json.get("per_page", 10)

    result = FavoriteService.get_user_favorites(user_id, search, page, per_page)
    if result or result == []:
        return paginated_favorites_schema.jsonify(result), 200
    else:
        abort(400, description="Bad Request")


@bp.route("/add", methods=["POST"])
@jwt_required()
def add():
    request_data = request.json

    errors = favorite_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Bad Request"),
            400,
        )

    # add favorite
    user_id = get_jwt_identity()
    favorite_id = FavoriteService.add_favorite(
        english=request_data["english"],
        darija=request_data["darija"],
        arabic=request_data.get("arabic", None),
        verified=request_data.get("verified", None),
        word_type=request_data.get("word_type", None),
        user_id=user_id,
    )

    if not favorite_id:
        return (
            jsonify(
                message="An error has been occured while trying to process your request!"
            ),
            400,
        )

    return jsonify(favorite_id), 200


@bp.route("/add-from-dictionary", methods=["POST"])
@jwt_required()
def add_from_dictionary():
    request_data = request.get_json()
    dictionary_id = request_data.get("id", None)
    if not dictionary_id:
        return (
            jsonify(message="Bad Request"),
            400,
        )

    # add favorite
    user_id = get_jwt_identity()
    result = FavoriteService.add_favorite_from_dictionary(
        dictionary_id, user_id
    )

    if not result:
        return (
            jsonify(
                message="An error has been occured while trying to process your request!"
            ),
            400,
        )

    return jsonify("Added"), 200


@bp.route("/delete/<int:favorite_id>", methods=["DELETE"])
@jwt_required()
def remove(favorite_id):
    user_id = get_jwt_identity()
    FavoriteService.remove_favorite(favorite_id, user_id)
    return jsonify("Deleted"), 200


@bp.route("/remove-dictionary/<int:dictionary_id>", methods=["DELETE"])
@jwt_required()
def removeDictionary(dictionary_id):
    user_id = get_jwt_identity()
    FavoriteService.remove_dictionary_favorite(dictionary_id, user_id)
    return jsonify("Deleted"), 200
