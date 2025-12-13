from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    restaurant_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    subscription_status = Column(String, default="free")  # free, monthly, yearly
    stripe_customer_id = Column(String, nullable=True)
