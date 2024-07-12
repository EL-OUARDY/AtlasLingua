from app.models.dictionary import Dictionary


def get_list():
    return Dictionary.query.all()
