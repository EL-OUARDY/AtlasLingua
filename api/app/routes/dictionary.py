import math
from flask import Blueprint, json, jsonify, request
from app.schemas.dictionary_schema import dictionaries_schema
from app.services.dictionary_service import AuthService

bp = Blueprint("dictionary", __name__, url_prefix="/api/dictionary")


@bp.route("/list")
def get_list():
    page = int(request.args.get("pageIndex", 0)) + 1  # Convert to 1-indexed
    per_page = int(request.args.get("pageSize", 10))
    sort_by = request.args.get("sortBy", "id")
    sort_order = request.args.get("sortOrder", "asc")
    filters = request.args.get("filters", "{}")
    search = request.args.get("search", None)

    # Parse the filters
    filters_dict = json.loads(filters)

    # Apply sorting and filtering
    data = AuthService.get_list(
        page, per_page, sort_by, sort_order, filters_dict, search
    )

    return data, 200


@bp.route("/category", methods=["POST"])
def get_category():
    data = request.get_json()
    _list = AuthService.get_category(data.get("category"))
    return dictionaries_schema.jsonify(_list), 200
