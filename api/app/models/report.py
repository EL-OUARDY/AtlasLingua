from app import db
from app.models.base_model import BaseModel


class Report(db.Model, BaseModel):
    __tablename__ = "reports"
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    translation_id = db.Column(
        db.Integer, db.ForeignKey("history.id"), nullable=False
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
