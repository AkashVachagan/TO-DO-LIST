from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

postgres_url = "postgresql://postgres:Vacha%402006@localhost:5432/TODO"

engine = create_engine(postgres_url)

sessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

Base = declarative_base()