from flask import Blueprint, jsonify, request

from app.schemas.translate_request_schema import translate_request_schema
from app.services.translation_service import TranslationService

bp = Blueprint("translation", __name__, url_prefix="/api/translate")


@bp.route("/", methods=["POST"])
def translate():
    request_data = request.json

    errors = translate_request_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Invalid translation request"),
            400,
        )
    translation = TranslationService.translate(
        request_data["text"],
        request_data["source"],
        request_data["destination"],
    )
    if translation:
        return jsonify(translation), 200

    return (
        jsonify(message="Can't proccess your request. Please try again!"),
        400,
    )