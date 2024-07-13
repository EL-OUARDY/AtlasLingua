import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PWD = os.getenv("MYSQL_PWD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DB = os.getenv("MYSQL_DB")
SQLALCHEMY_DATABASE_URI = "mysql+mysqldb://{}:{}@{}/{}".format(
    MYSQL_USER, MYSQL_PWD, MYSQL_HOST, MYSQL_DB
)

# Create an engine
engine = create_engine(SQLALCHEMY_DATABASE_URI)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()
