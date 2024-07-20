from app import db
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models.history import History
from app.schemas.history_schema import history_schema, histories_schema
from app.utils.shared import LanguagesEnum


class HistoryService:

    @staticmethod
    def get_user_history(user_id):
        result = History.query.filter_by(user_id=user_id)
        return histories_schema.dump(result)

    @staticmethod
    @jwt_required(optional=True)
    def save(source_language, english, darija, processed_by=None):
        history = History(
            english=english,
            darija=darija,
            processed_by=processed_by,
            source_language=source_language,
        )

        history.user_id = get_jwt_identity()

        db.session.add(history)
        db.session.commit()
        pass

    @staticmethod
    def get_from_history(text_to_translate, source, destination, processed_by):
        filter_attribute = (
            "english" if source == LanguagesEnum.ENGLISH.value else "darija"
        )
        filter = {filter_attribute: text_to_translate}
        filter["processed_by"] = processed_by

        result = history_schema.dump(History.query.filter_by(**filter).first())
        if result:
            # save to history again
            return result.get(destination)
