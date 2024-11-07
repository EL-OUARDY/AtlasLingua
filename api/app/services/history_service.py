from flask import abort
from sqlalchemy import desc
from app import db
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models.history import History
from app.schemas.history_schema import history_schema, histories_schema
from app.utils.shared import LanguagesEnum


class HistoryService:

    @staticmethod
    def get_user_history(user_id):
        result = (
            History.query.filter_by(user_id=user_id, deleted=False)
            .order_by(desc(History.created_at))
            .limit(100)  # pagination will be implimented later
            .all()
        )
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

        return history.id, history.shareable_link

    @staticmethod
    def get_from_history(text_to_translate, source, destination, processed_by):
        filter_attribute = (
            "english" if source == LanguagesEnum.ENGLISH.value else "darija"
        )
        filter = {filter_attribute: text_to_translate}
        filter["processed_by"] = processed_by

        result = history_schema.dump(
            History.query.filter_by(**filter)
            .order_by(History.id.desc())
            .first()
        )
        if result:
            # save to history again
            return result.get(destination)

    @staticmethod
    @jwt_required()
    def delete_user_history(history_id):
        user_id = get_jwt_identity()
        history = History.query.get_or_404(history_id)

        if history.user_id != user_id:
            abort(401)  # unauthorized

        history.deleted = True
        db.session.commit()

    @staticmethod
    @jwt_required()
    def delete_all_user_history():
        user_id = get_jwt_identity()

        History.query.filter(History.user_id == user_id).update(
            {History.deleted: True}
        )

        db.session.commit()
