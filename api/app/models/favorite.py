from app import db
from app.models.base_model import BaseModel


class Favorite(db.Model, BaseModel):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    english = db.Column(db.Text, nullable=False)
    darija = db.Column(db.Text, nullable=False)
    arabic = db.Column(db.Text, nullable=True)
    word_type = db.Column(db.String(128), nullable=True)
    verified = db.Column(db.Boolean, nullable=True, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    dictionary_id = db.Column(db.Integer, nullable=True)
