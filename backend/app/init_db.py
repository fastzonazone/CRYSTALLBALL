from app.db import engine, Base
from app.models.user import User
from app.models.uploaded_data import UploadedData
from app.models.prediction import Prediction, MLModel

# Create all tables
def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
