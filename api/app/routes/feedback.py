from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.schemas.feedback_schema import feedback_schema
from app.services.feedback_service import FeedbackService


bp = Blueprint("feedback", __name__, url_prefix="/api/feedback")


@bp.route("/", methods=["POST"])
@jwt_required()
def feedback():
    request_data = request.json

    errors = feedback_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Invalid feedback request"),
            400,
        )

    # save feedback
    result = FeedbackService.save(
        subject=request_data["subject"],
        body=request_data["body"],
        user_id=get_jwt_identity(),
    )

    if not result:
        return (
            jsonify(
                message="An error has been occured while trying to submit your feedback!"
            ),
            400,
        )

    return (
        jsonify(message="Feedback has been sent successfully!"),
        200,
    )
