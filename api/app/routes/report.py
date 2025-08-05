from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.schemas.report_schema import report_schema
from app.services.auth_service import AuthService
from app.services.report_service import ReportService


bp = Blueprint("report", __name__, url_prefix="/report")


@bp.route("/", methods=["POST"])
@jwt_required()
def report():
    request_data = request.json
    errors = report_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Invalid report request"),
            400,
        )

    # save report
    current_user_id = get_jwt_identity()
    user = AuthService.get_user_by_id(current_user_id)
    result = ReportService.save(
        translation_id=request_data["translation_id"],
        body=request_data["body"],
        user=user,
    )

    if not result:
        return (
            jsonify(
                message="An error has been occured while trying to submit your report!"
            ),
            400,
        )

    return (
        jsonify(message="Report has been sent successfully!"),
        200,
    )
