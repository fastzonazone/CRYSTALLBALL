from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Date, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
from app.db import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    uploaded_data_id = Column(Integer, ForeignKey("uploaded_data.id", ondelete="CASCADE"))
    prediction_date = Column(Date, nullable=False, index=True)
    predicted_covers = Column(Integer)
    confidence = Column(Float)
    weather = Column(String, nullable=True) # New field
    actual_covers = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    uploaded_data = relationship("UploadedData")

class MLModel(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    model_binary = Column(LargeBinary) # serialized model
    model_stats = Column(JSON) # { n_samples, mean, std, trend, seasonality }
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    # No unique constraint enforced here for now, logic will handle latest
