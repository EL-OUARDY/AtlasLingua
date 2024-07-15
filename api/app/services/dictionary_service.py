from sqlalchemy import or_
from app.models.dictionary import Dictionary


class AuthService:
    @staticmethod
    def get_list():
        # return Dictionary.query.filter(Dictionary.group_id.is_(None)).all()
        return Dictionary.query.all()

    @staticmethod
    def get_category(cat):
        return Dictionary.query.filter_by(category=cat, group_id=None)

    @staticmethod
    def get_word_writings(word_id):
        """This will return a word and its different ways of writing"""
        return Dictionary.query.filter(
            or_(Dictionary.id == word_id, Dictionary.group_id == word_id)
        ).all()
