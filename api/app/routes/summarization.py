from flask import Blueprint, jsonify, request

from app.schemas.summarization_request_schema import (
    summarization_request_schema,
)
from app.services.summarization_service import SummarizationService

bp = Blueprint("summarization", __name__, url_prefix="/summarize")


@bp.route("/", methods=["POST"])
def summarize():
    request_data = request.json

    errors = summarization_request_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Invalid summarization request"),
            400,
        )

    # limit summarization for longer texts
    if len(request_data["text"]) > 5000:
        return (
            jsonify(
                message="Currently, we are unable to process lengthy texts (Limit = 5000 letters)"
            ),
            400,
        )

    summarization = SummarizationService.summarize(
        request_data["text"],
    )
    if summarization:
        return summarization, 200

    return (
        jsonify(message="Can't proccess your request. Please try again!"),
        400,
    )
