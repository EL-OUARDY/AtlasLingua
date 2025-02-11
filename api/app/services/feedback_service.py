from app import db
from app.models.feedback import Feedback
from app.services.email_service import EmailService


class FeedbackService:
    @staticmethod
    def save(subject, body, user):
        try:
            feedback = Feedback(subject=subject, body=body, user_id=user.id)
            db.session.add(feedback)
            db.session.commit()

            # Notify the administration via email about the new feedback
            EmailService.send_feedback_form_email(user, subject, body)

            return feedback
        except:
            return None
