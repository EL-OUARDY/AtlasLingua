from sqlalchemy import or_
from app.models.dictionary import Dictionary


class AuthService:
    @staticmethod
    def get_list():
        # return Dictionary.query.filter(Dictionary.group_id.is_(None)).all()
        return Dictionary.query.all()

    @staticmethod
    def get_word_writings(word_id):
        return Dictionary.query.filter(
            or_(Dictionary.id == word_id, Dictionary.group_id == word_id)
        ).all()
