from app import db
from app.models.base_model import BaseModel


class History(db.Model, BaseModel):
    __tablename__ = "history"

    id = db.Column(db.Integer, primary_key=True)
    english = db.Column(db.Text, nullable=False)
    darija = db.Column(db.Text, nullable=False)
    processed_by = db.Column(db.String(128), nullable=True)
    source_language = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    deleted = db.Column(db.Boolean, nullable=False, default=False)