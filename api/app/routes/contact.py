from flask import Blueprint, jsonify, request

from app.schemas.contact_schema import contact_schema
from app.services.contact_service import ContactService


bp = Blueprint("contact", __name__, url_prefix="/api/contact")


@bp.route("/", methods=["POST"])
def contact():
    request_data = request.json

    errors = contact_schema.validate(request_data)
    if errors:
        return (
            jsonify(message="Invalid contact request"),
            400,
        )

    # call contact service
    result = ContactService.save(
        name=request_data["name"],
        email=request_data["email"],
        subject=request_data["subject"],
        message=request_data["message"],
    )

    if not result:
        return (
            jsonify(
                message="An error has been occured while trying to process your request!"
            ),
            400,
        )

    return (
        jsonify(
            message="Your message has been sent successfully! We will reach out to you soon."
        ),
        200,
    )
