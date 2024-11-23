from flask import Blueprint, jsonify, make_response, request, url_for, redirect
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    create_refresh_token,
)

import os
from datetime import timedelta

from app.schemas.user_schema import user_schema
from app.schemas.login_schema import login_schema
from app.services.auth_service import AuthService

from app import oauth

# Initialize the Google client
google = oauth.create_client("google")


bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/register", methods=["POST"])
def register():
    # validate posted data
    errors = user_schema.validate(request.json)
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
        user = AuthService.get_user_by_email(data["email"])
        response = jsonify(user_schema.dump(user))

        # set JWT cookies
        set_access_cookies(response, access_token, max_age=timedelta(hours=1))
        set_refresh_cookies(response, refresh_token, max_age=timedelta(days=30))

        return response, 200

    return jsonify(message="Invalid credentials"), 400


@bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify(message="Logout successful")
    unset_jwt_cookies(response)
    return response, 200


@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)

    response = jsonify(message="Login successful")

    # set JWT cookies
    set_access_cookies(response, new_access_token, max_age=timedelta(hours=1))

    return response, 200


@bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = AuthService.get_user_by_id(current_user_id)
    return user_schema.dump(user), 200


@bp.route("/login/google")
def login_google():
    redirect_uri = url_for("auth.authorize_google", _external=True)
    return google.authorize_redirect(redirect_uri)


@bp.route("/authorize/google")
def authorize_google():
    token = google.authorize_access_token()
    if not token:
        return jsonify(message="Failed to authenticate."), 400

    resp = google.get("oauth2/v3/userinfo")
    user_info = resp.json()
    user = AuthService.process_google_user(user_info)
    if user:
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        response = make_response(redirect(f"{os.getenv('FRONTEND_URL')}/login"))
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response
    return jsonify(message="Failed to authenticate."), 400
