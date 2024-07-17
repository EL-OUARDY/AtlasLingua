from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
)

from app.schemas.user_schema import user_schema
from app.schemas.login_schema import login_schema
from app.services.auth_service import AuthService


bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # validate posted data
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    user_data = user_schema.load(request.json)
    user = AuthService.register_user(
        user_data["name"], user_data["email"], user_data["password"]
    )
    return user_schema.dump(user), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # validate posted data
    errors = login_schema.validate(data)
    if errors:
        return jsonify(message="Invalid credentials"), 400

    access_token, refresh_token = AuthService.login_user(
        data["email"], data["password"]
    )
    if access_token and refresh_token:
        response = jsonify(message="Login successful")

        # Set JWT cookies
        set_access_cookies(response, access_token, max_age=timedelta(hours=1))
        set_refresh_cookies(response, refresh_token, max_age=timedelta(days=30))

        return response, 200

    return jsonify(message="Invalid credentials"), 400


@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)

    response = jsonify(access_token=new_access_token)

    # set JWT cookies
    set_access_cookies(response, new_access_token, max_age=timedelta(hours=1))

    return response, 200


@bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = AuthService.get_user_by_id(current_user_id)
    return user_schema.dump(user), 200
