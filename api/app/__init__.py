from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os
from flask_bcrypt import Bcrypt

# Initialize the database, migration, marshmallow and JWT manager objects
db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
jwt = JWTManager()
bcrypt = Bcrypt()


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
        resources={r"/api/*": {"origins": os.getenv("FRONTEND_URL")}},
    )

    # Configure the Flask application from environment variable
    app.config.from_object(
        os.getenv("APP_SETTINGS", "config.DevelopmentConfig")
    )

    # Configure JWT
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

    # Initialize the database, migration, marshmallow and JWT manager with the app
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)

    # Import and register Blueprints for the application routes
    from app.routes import dictionary
    from app.routes import auth
    from app.routes import translation
    from app.routes import history
    from app.routes import feedback

    app.register_blueprint(dictionary.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(translation.bp)
    app.register_blueprint(history.bp)
    app.register_blueprint(feedback.bp)

    # Return the configured app instance
    return app
