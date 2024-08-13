from flask import Blueprint, abort, jsonify, request

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

    # limit translation for longer texts
    if len(request_data["text"]) > 500:
        return (
            jsonify(
                message="Currently, we are unable to process lengthy texts (Limit = 500 characters)."
            ),
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


@bp.route("/get/<string:shareable_link>")
def get_translation(shareable_link: str):
    if not isinstance(shareable_link, str) or len(shareable_link) == 0:
        return jsonify({"error": "Invalid link"}), 400

    translation = TranslationService.get_shared_translation(shareable_link)

    if not translation:
        return jsonify({"error": "Translation not found"}), 404

    return jsonify(translation), 200
