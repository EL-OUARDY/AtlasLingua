from app import db
from app.models.history import History
from app.models.report import Report
from app.services.email_service import EmailService


class ReportService:
    @staticmethod
    def save(translation_id, body, user):
        try:
            report = Report(
                translation_id=translation_id, body=body, user_id=user.id
            )
            db.session.add(report)
            db.session.commit()

            # Notify the administration via email about the new translation report
            translation = History.query.get(translation_id)
            EmailService.send_translation_report_email(
                user, translation, comment=body
            )

            return report
        except:
            return None
