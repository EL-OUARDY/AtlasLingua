from app.models.history import History
from app import db


class HistoryService:
    @staticmethod
    def save(english, darija, processed_by):
        history = History(
            english=english, darija=darija, processed_by=processed_by
        )
        db.session.add(history)
        db.session.commit()
        pass
