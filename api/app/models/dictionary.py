from app import db
from app.models.base_model import BaseModel


class Dictionary(db.Model, BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    darija = db.Column(db.String(255), nullable=False)
    english = db.Column(db.String(255), nullable=False)
    arabic = db.Column(db.String(255), nullable=True)
    word_type = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(255), nullable=True)
    verified = db.Column(db.Boolean, nullable=False)
    popularity = db.Column(db.Integer, nullable=False, default=0)
    source = db.Column(db.String(255), nullable=True)
    group_id = db.Column(db.Integer, nullable=True)
