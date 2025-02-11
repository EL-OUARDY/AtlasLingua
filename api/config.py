import os


class Config:
    APP_NAME = os.getenv("APP_NAME")
    SECRET_KEY = os.getenv("SECRET_KEY")

    # Database
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PWD = os.getenv("MYSQL_PWD")
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_DB = os.getenv("MYSQL_DB")
    SQLALCHEMY_DATABASE_URI = "mysql+mysqldb://{}:{}@{}/{}".format(
        MYSQL_USER, MYSQL_PWD, MYSQL_HOST, MYSQL_DB
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Config
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True  # Only allow cookies to be sent over HTTPS
    JWT_COOKIE_CSRF_PROTECT = True  # Enable CSRF protection
    JWT_COOKIE_SAMESITE = "Lax"  # Set SameSite policy

    # OAuth Config
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"ssl": {"ssl_mode": "REQUIRED"}}
    }

    DEBUG = False
