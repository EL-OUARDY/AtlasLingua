from flask import Blueprint
from app.schemas.dictionary_schema import dictionaries_schema
from app.services.dictionary_service import AuthService

bp = Blueprint("dictionary", __name__, url_prefix="/api/dictionary")


@bp.route("/list")
def list():
    list = AuthService.get_list()
    return dictionaries_schema.jsonify(list), 200
