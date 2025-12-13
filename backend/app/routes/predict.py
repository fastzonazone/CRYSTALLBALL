from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db import get_db
from app.models.user import User
from app.models.prediction import Prediction
# from app.utils.auth_utils import get_current_user

router = APIRouter()

@router.get("/latest")
async def get_latest_predictions(
    db: Session = Depends(get_db)
    # current_user: User = Depends(get_current_user)
):
    # Mock user for now
    # current_user = db.query(User).first()
    # if not current_user:
    #      return {"predictions": [], "stats": {}}

    user_id = 1 # Temporary hardcode until auth enabled
    
    predictions = db.query(Prediction).filter(
        Prediction.user_id == user_id
    ).order_by(Prediction.prediction_date).all()
    
    if not predictions:
        return {"predictions": [], "stats": {}}
        
    return {
        "predictions": predictions,
        "stats": {
            "count": len(predictions)
        }
    }
