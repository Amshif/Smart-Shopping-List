from sqlalchemy import create_engine
from urllib.parse import quote_plus
from sqlalchemy.orm import sessionmaker, declarative_base
from dotmap import DotMap

from app.config import Settings

settings = Settings()

db = {}
for key, value in vars(settings).items():
    _key = key.replace('db_', '')
    db[_key] = value
db = DotMap(db)

dialect = 'postgresql'
password = quote_plus(db.password)
SQLALCHEMY_DATABASE_URL = f'{dialect}://{db.user}:{password}@{db.host}:{db.port}/{db.name}'


engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()