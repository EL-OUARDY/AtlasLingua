from app import db
from app.models.feedback import Feedback


class FeedbackService:
    @staticmethod
    def save(subject, body, user_id):
        try:
            feedback = Feedback(subject=subject, body=body, user_id=user_id)
            db.session.add(feedback)
            db.session.commit()
            return feedback
        except:
            return None
