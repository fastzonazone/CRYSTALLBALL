from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
from app.db import Base

class UploadedData(Base):
    __tablename__ = "uploaded_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    file_name = Column(String)
    data = Column(JSON)  # raw CSV rows: [{date, covers}, ...]
    n_rows = Column(Integer)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

    __table_args__ = (UniqueConstraint('user_id', 'uploaded_at', name='_user_upload_uc'),)
