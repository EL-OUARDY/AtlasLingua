from app import db
from app.models.contact import Contact


class ContactService:
    @staticmethod
    def save(name, email, subject, message):
        try:
            contact = Contact(
                name=name,
                email=email,
                subject=subject,
                message=message,
            )
            db.session.add(contact)
            db.session.commit()
            return contact
        except:
            return None
