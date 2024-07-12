from app import db
from app.models.base_model import BaseModel


class Dictionary(db.Model, BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    darija = db.Column(db.String(80), nullable=False)
    english = db.Column(db.String(80), nullable=False)
    type = db.Column(
        db.Enum(
            "noun", "verb", "adjective", "adverb", "preposition", "pronoun "
        ),
        nullable=False,
    )
    verified = db.Column(db.Boolean, nullable=False)
    views_number = db.Column(db.Integer, nullable=False, default=0)
    source = db.Column(db.String(80), nullable=True)
