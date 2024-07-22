from app import db
from app.models.base_model import BaseModel


class Feedback(db.Model, BaseModel):
    __tablename__ = "feedback"
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
