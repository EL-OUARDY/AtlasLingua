from app.models.dictionary import Dictionary


class AuthService:
    @staticmethod
    def get_list():
        return Dictionary.query.all()
