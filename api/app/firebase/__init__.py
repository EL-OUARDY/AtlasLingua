import firebase_admin
from firebase_admin import credentials
import os


def initialize_firebase(app):
    """Initialize Firebase Admin SDK"""
    try:
        # Get the path to service account file from environment variable
        cred = credentials.Certificate(
            os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
        )
        firebase_admin.initialize_app(cred)
    except Exception as e:
        app.logger.error(f"Failed to initialize Firebase: {str(e)}")
