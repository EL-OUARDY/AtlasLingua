from app import db
from app.models.base_model import BaseModel


class Contribution(db.Model, BaseModel):
    __tablename__ = "contributions"
    id = db.Column(db.Integer, primary_key=True)
    contribution_type = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    links = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
