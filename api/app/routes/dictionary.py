from flask import Blueprint, request
from app.schemas.dictionary_schema import dictionaries_schema
from app.services.dictionary_service import DictionaryService

bp = Blueprint("dictionary", __name__, url_prefix="/api/dictionary")


@bp.route("/list", methods=["POST"])
def get_list():
    request_data = request.get_json()
    page = int(request_data.get("pageIndex", 0)) + 1  # Convert to 1-indexed
    per_page = int(request_data.get("pageSize", 5))
    sort_by = request_data.get("sortBy", "id")
    sort_order = request_data.get("sortOrder", "asc")
    search = request_data.get("search", None)
    filters_dict = request_data.get("filters", {})
    types_list = request_data.get("wordTypes", [])

    # Apply sorting and filtering
    data = DictionaryService.get_list(
        page, per_page, sort_by, sort_order, filters_dict, search, types_list
    )

    return data, 200


@bp.route("/category", methods=["POST"])
def get_category():
    data = request.get_json()
    _list = DictionaryService.get_category(data.get("category"))
    return dictionaries_schema.jsonify(_list), 200
