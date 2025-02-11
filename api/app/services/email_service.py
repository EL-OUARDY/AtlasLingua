import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, To


class EmailService:
    sender_email = os.getenv("MAIL_SENDER_EMAIL")
    admin_email = os.getenv("MAIL_ADMIN_EMAIL")
    api_key = os.getenv("MAIL_SENDGRID_API_KEY")
    app_name = os.getenv("APP_NAME")

    @staticmethod
    def send_reset_email(recipient_name, recipient_email, reset_link):
        template_id = os.getenv("MAIL_SENDGRID_RESET_PASSWORD_TEMPLATE_ID")

        message = Mail(
            from_email=From(EmailService.sender_email, EmailService.app_name),
            to_emails=To(recipient_email),
        )
        message.dynamic_template_data = {
            "recipient_name": recipient_name,
            "reset_link": reset_link,
        }
        message.template_id = template_id

        try:
            sg = SendGridAPIClient(EmailService.api_key)
            response = sg.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    def send_contact_form_email(name, email, subject, message_body):
        template_id = os.getenv("MAIL_SENDGRID_CONTACT_TEMPLATE_ID")

        message = Mail(
            from_email=From(EmailService.sender_email, EmailService.app_name),
            to_emails=To(EmailService.admin_email),
        )
        message.dynamic_template_data = {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message_body,
        }
        message.template_id = template_id

        try:
            sg = SendGridAPIClient(EmailService.api_key)
            response = sg.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    def send_feedback_form_email(user, subject, feedback):
        template_id = os.getenv("MAIL_SENDGRID_FEEDBACK_TEMPLATE_ID")

        message = Mail(
            from_email=From(EmailService.sender_email, EmailService.app_name),
            to_emails=To(EmailService.admin_email),
        )
        message.dynamic_template_data = {
            "name": user.name,
            "email": user.email,
            "subject": subject,
            "feedback": feedback,
        }
        message.template_id = template_id

        try:
            sg = SendGridAPIClient(EmailService.api_key)
            response = sg.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    def send_contribution_form_email(
        user, contribution_type, description, links
    ):
        template_id = os.getenv("MAIL_SENDGRID_CONTRIBUTION_TEMPLATE_ID")

        message = Mail(
            from_email=From(EmailService.sender_email, EmailService.app_name),
            to_emails=To(EmailService.admin_email),
        )
        message.dynamic_template_data = {
            "name": user.name,
            "email": user.email,
            "type": contribution_type,
            "description": description,
            "links": links,
        }
        message.template_id = template_id

        try:
            sg = SendGridAPIClient(EmailService.api_key)
            response = sg.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"An error occurred: {e}")
            return False
