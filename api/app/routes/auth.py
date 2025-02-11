from flask import Blueprint, jsonify, make_response, request, url_for, redirect
from flask_jwt_extended import (
    create_access_token,
    decode_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    create_refresh_token,
)

import os
from datetime import timedelta

from app.schemas.user_schema import user_schema, login_schema, register_schema
from app.services.auth_service import AuthService

from app import oauth
from app.services.firebase_service import FirebaseService

# Initialize the Google client
google = oauth.create_client("google")


bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/register", methods=["POST"])
def register():
    # validate posted data
    errors = register_schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    user_data = register_schema.load(request.json)

    user = AuthService.register_user(
        user_data["name"], user_data["email"], user_data["password"]
    )
    return register_schema.dump(user), 201


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

        # Add firebase token to user data
        user_data = user_schema.dump(user)
        user_data["firebase_token"] = FirebaseService.create_custom_token(
            str(user.id)
        )

        response = jsonify(user_data)

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

    # Add firebase token to user data
    user_data = user_schema.dump(user)
    user_data["firebase_token"] = FirebaseService.create_custom_token(
        str(user.id)
    )

    return jsonify(user_data), 200


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


@bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    user = AuthService.get_user_by_email(email)
    if not user:
        return (
            jsonify({"message": "No account found with this email address."}),
            404,
        )

    reset_token = create_access_token(
        identity=user.id, expires_delta=timedelta(hours=1)
    )
    reset_link = (
        f"{os.getenv('FRONTEND_URL')}/reset-password?token={reset_token}"
    )

    # send reset email
    response = AuthService.send_password_reset_email(
        user.name, user.email, reset_link
    )

    if response:
        return jsonify({"message": "Password reset email sent"}), 200

    return jsonify({"message": "Failed to send password reset email"}), 400


@bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    reset_token = data.get("token")
    new_password = data.get("new_password")

    if not reset_token or not new_password:
        return jsonify({"message": "Token and new password are required"}), 400

    try:
        # Decode the token to extract the user's identity
        decoded_token = decode_token(reset_token)
        user_id = decoded_token.get(
            "sub"
        )  # 'sub' typically stores the user's identity
    except Exception as e:
        return jsonify({"message": "Invalid or expired token"}), 400

    # Fetch the user from the database
    user = AuthService.get_user_by_id(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Update the user's password
    AuthService.update_user_password(user, new_password)
    return jsonify({"message": "Password updated successfully"}), 200


@bp.route("/update", methods=["POST"])
@jwt_required()
def update():
    # validate posted data
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(message="Failed to update user profile"), 400

    # check if changing user's email possible
    current_user_id = get_jwt_identity()
    user = AuthService.get_user_by_id(current_user_id)
    if user.email != data["email"] and AuthService.get_user_by_email(
        data["email"]
    ):
        return (
            jsonify(
                message="The email is already registered with another account"
            ),
            400,
        )

    try:
        AuthService.update_user(user, data)
        return jsonify(message="Updated successfully"), 200
    except Exception as e:
        return jsonify(message="Failed to update user profile"), 400
