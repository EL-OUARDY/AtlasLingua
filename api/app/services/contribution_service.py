from app import db
from app.models.contribution import Contribution
from app.services.email_service import EmailService


class ContributionService:
    @staticmethod
    def save(contribution_type, description, links, user):
        try:
            contribution = Contribution(
                contribution_type=contribution_type,
                description=description,
                links=links,
                user_id=user.id,
            )
            db.session.add(contribution)
            db.session.commit()

            # Notify the administration via email about the new contribution request
            EmailService.send_contribution_form_email(
                user, contribution_type, description, links
            )

            return contribution
        except:
            return None
