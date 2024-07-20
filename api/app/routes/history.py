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
