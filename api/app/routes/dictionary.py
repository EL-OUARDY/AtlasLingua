from flask import Blueprint, jsonify, request
from app.schemas.dictionary_schema import dictionaries_schema
from app.services.dictionary_service import AuthService

bp = Blueprint("dictionary", __name__, url_prefix="/api/dictionary")


@bp.route("/list")
def get_list():
    _list = AuthService.get_list()
    return dictionaries_schema.jsonify(_list), 200


@bp.route("/category", methods=["POST"])
def get_category():
    data = request.get_json()
    _list = AuthService.get_category(data.get("category"))
    return dictionaries_schema.jsonify(_list), 200
