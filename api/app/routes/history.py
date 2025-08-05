from flask import Blueprint, abort, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.services.history_service import HistoryService

from app.schemas.history_schema import paginated_history_schema


bp = Blueprint("history", __name__, url_prefix="/history")


@bp.route("/", methods=["POST"])
@jwt_required()
def list():
    user_id = get_jwt_identity()
    page = request.json.get("page", 1)
    per_page = request.json.get("per_page", 10)

    result = HistoryService.get_user_history(user_id, page, per_page)
    if result or result == []:
        return paginated_history_schema.jsonify(result), 200
    else:
        abort(400, description="Bad Request")


@bp.route("/delete/<int:history_id>", methods=["DELETE"])
@jwt_required()
def delete(history_id):
    HistoryService.delete_user_history(history_id)
    return jsonify("Deleted"), 200


@bp.route("/delete_all", methods=["DELETE"])
@jwt_required()
def delete_all():
    HistoryService.delete_all_user_history()
    return jsonify("Deleted"), 200
