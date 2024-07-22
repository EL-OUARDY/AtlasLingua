from app import db, bcrypt
from app.models.base_model import BaseModel


class User(db.Model, BaseModel):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    name = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(64), nullable=True)
    feedback = db.relationship("Feedback", backref="user", lazy=True)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
