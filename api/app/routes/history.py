from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.services.history_service import HistoryService


bp = Blueprint("history", __name__, url_prefix="/api/history")


@bp.route("/")
@jwt_required()
def list():
    user_id = get_jwt_identity()
    list = HistoryService.get_user_history(user_id)
    return jsonify(list), 200


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
