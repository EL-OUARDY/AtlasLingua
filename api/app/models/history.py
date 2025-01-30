from app import db
from app.models.base_model import BaseModel
from app.utils.helpers import generate_shareable_link_id


class History(db.Model, BaseModel):
    __tablename__ = "history"

    id = db.Column(db.Integer, primary_key=True)
    english = db.Column(db.Text, nullable=False)
    darija = db.Column(db.Text, nullable=False)
    arabic = db.Column(db.Text, nullable=True)
    processed_by = db.Column(db.String(128), nullable=True)
    source_language = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    deleted = db.Column(db.Boolean, nullable=False, default=False)
    shareable_link = db.Column(
        db.String(15),
        nullable=False,
        unique=True,
        default=generate_shareable_link_id,
    )
