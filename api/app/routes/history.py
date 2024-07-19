from flask import Blueprint


bp = Blueprint("history", __name__, url_prefix="/api/history")


@bp.route("/")
def list():
    return "Hello World"
