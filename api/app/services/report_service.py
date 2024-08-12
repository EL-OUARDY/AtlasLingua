from app import db
from app.models.report import Report


class ReportService:
    @staticmethod
    def save(translation_id, body, user_id):
        try:
            report = Report(
                translation_id=translation_id, body=body, user_id=user_id
            )
            db.session.add(report)
            db.session.commit()
            return report
        except:
            return None
