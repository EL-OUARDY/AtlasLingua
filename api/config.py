import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PWD = os.getenv("MYSQL_PWD")
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_DB = os.getenv("MYSQL_DB")
    SQLALCHEMY_DATABASE_URI = "mysql+mysqldb://{}:{}@{}/{}".format(
        MYSQL_USER, MYSQL_PWD, MYSQL_HOST, MYSQL_DB
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"ssl": {"ssl_mode": "REQUIRED"}}
    }

    DEBUG = False
