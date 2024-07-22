from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.schemas.contribution_schema import contribution_schema
from app.services.contribution_service import ContributionService


bp = Blueprint("contribution", __name__, url_prefix="/api/contribution")


@bp.route("/", methods=["POST"])
@jwt_required()
def contribution():
    request_data = request.json

    errors = contribution_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Invalid contribution request"),
            400,
        )

    # save contribution
    result = ContributionService.save(
        contribution_type=request_data["contribution_type"],
        description=request_data["description"],
        links=request_data["links"],
        user_id=get_jwt_identity(),
    )

    if not result:
        return (
            jsonify(
                message="An error has been occured while trying to submit your contribution!"
            ),
            400,
        )

    return (
        jsonify(message="Contribution has been made successfully! Thank you."),
        200,
    )
