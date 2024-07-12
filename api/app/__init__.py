from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Initialize the database, migration, marshmallow and JWT manager objects
db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
jwt = JWTManager()


def create_app():
    """
    Create and configure the Flask application.

    Returns:
        app: The configured Flask application instance.
    """

    # Create an instance of the Flask class
    app = Flask(__name__)

    # Load environment variables from a .env file
    load_dotenv()

    # Configure the Flask application from environment variable
    app.config.from_object(
        os.getenv("APP_SETTINGS", "config.DevelopmentConfig")
    )

    # Initialize the database, migration, marshmallow and JWT manager with the app
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)

    # Import and register Blueprints for the application routes
    from app.routes import dictionary

    app.register_blueprint(dictionary.bp)

    # Return the configured app instance
    return app
