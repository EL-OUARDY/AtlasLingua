from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os
from flask_bcrypt import Bcrypt
from authlib.integrations.flask_client import OAuth
from flask_mail import Mail
from app.firebase import initialize_firebase

# Initialize Flask extensions
db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
jwt = JWTManager()
bcrypt = Bcrypt()
oauth = OAuth()
mail = Mail()


def create_app():
    """
    Create and configure the Flask application.

    Returns:
        app: The configured Flask application instance.
    """

    # Create an instance of the Flask class
    app = Flask(__name__)
    app.url_map.strict_slashes = False

    # Load environment variables from a .env file
    load_dotenv()

    # Restrict CORS
    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/api/*": {"origins": os.getenv("CORS_ALLOWED_DOMAINS").split(",")}
        },
    )

    # Configure the Flask application from environment variable
    app.config.from_object(
        os.getenv("APP_SETTINGS", "config.DevelopmentConfig")
    )

    # Google OAuth setup
    oauth.init_app(app)
    google = oauth.register(
        name="google",
        client_id=app.config["GOOGLE_CLIENT_ID"],
        client_secret=app.config["GOOGLE_CLIENT_SECRET"],
        server_metadata_url=app.config["GOOGLE_DISCOVERY_URL"],
        access_token_url="https://oauth2.googleapis.com/token",
        authorize_url="https://accounts.google.com/o/oauth2/auth",
        api_base_url="https://www.googleapis.com/",
        client_kwargs={"scope": "openid email profile"},
    )

    # Initialize Flask extensions
    db.init_app(app)  # database
    migrate.init_app(app, db)  # migration
    ma.init_app(app)  # marshmallow
    jwt.init_app(app)  # JWT manager
    mail.init_app(app)  # Mail
    initialize_firebase(app)  # Firebase

    # Import and register Blueprints for the application routes
    from app.routes import dictionary
    from app.routes import auth
    from app.routes import translation
    from app.routes import summarization
    from app.routes import history
    from app.routes import feedback
    from app.routes import contribution
    from app.routes import contact
    from app.routes import favorite
    from app.routes import report

    app.register_blueprint(dictionary.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(translation.bp)
    app.register_blueprint(summarization.bp)
    app.register_blueprint(history.bp)
    app.register_blueprint(feedback.bp)
    app.register_blueprint(contribution.bp)
    app.register_blueprint(contact.bp)
    app.register_blueprint(favorite.bp)
    app.register_blueprint(report.bp)

    # Return the configured app instance
    return app
