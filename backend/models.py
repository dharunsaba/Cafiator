from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database Setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cafes.db")
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Cafe(Base):
    __tablename__ = "cafes"

    id = Column(Integer, primary_key=True)
    osm_id = Column(String, unique=True, index=True)
    name = Column(String)
    city = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    location = Column(String, nullable=True) # e.g. "Anna Nagar, Chennai"
    tags = Column(String)        # aesthetic, hidden_gem, etc
    opening_hours = Column(String)
    rating = Column(Float, default=0.0)
    
    # New Fields for Submissions
    is_verified = Column(Integer, default=1) # 1=Verified, 0=Pending (Using Int for SQLite bool compat)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    last_updated_at = Column(DateTime, default=datetime.utcnow)
    
    reviews = relationship("Review", back_populates="cafe")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String)
    
    reviews = relationship("Review", back_populates="user")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True)
    cafe_id = Column(Integer, ForeignKey("cafes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(String)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    cafe = relationship("Cafe", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
