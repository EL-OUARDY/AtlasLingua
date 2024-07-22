from app import db
from app.models.contribution import Contribution


class ContributionService:
    @staticmethod
    def save(contribution_type, description, links, user_id):
        try:
            contribution = Contribution(
                contribution_type=contribution_type,
                description=description,
                links=links,
                user_id=user_id,
            )
            db.session.add(contribution)
            db.session.commit()
            return contribution
        except:
            return None
