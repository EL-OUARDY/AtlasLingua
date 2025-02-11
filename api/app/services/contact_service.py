from app import db
from app.models.contact import Contact
from app.services.email_service import EmailService


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

            # Notify the administration via email about the new contact request
            EmailService.send_contact_form_email(name, email, subject, message)

            return contact
        except:
            return None
