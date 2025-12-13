from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
from app.models.uploaded_data import UploadedData
from app.models.prediction import Prediction, MLModel
from app.utils.auth_utils import verify_password
from app.ml.predictor import CrystalBallPredictor
import pandas as pd
import io
import json
from datetime import datetime

router = APIRouter()

# TODO: Add auth dependency
# from app.utils.auth_utils import get_current_user

@router.post("")
async def upload_csv(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db) 
    # current_user: User = Depends(get_current_user)
):
    # Temporary mock user for dev until auth middleware is fully hooked up
    # current_user = db.query(User).first()
    # if not current_user:
    #     raise HTTPException(status_code=400, detail="No users in DB")
    
    # 1. Parse CSV
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")
    
    # 2. Validation
    # Case insensitive columns
    df.columns = [c.lower() for c in df.columns]
    if not {'date', 'covers'}.issubset(df.columns):
        raise HTTPException(status_code=400, detail="CSV must contain 'date' and 'covers' columns")
    
    try:
        df['date'] = pd.to_datetime(df['date'])
    except:
        raise HTTPException(status_code=400, detail="Invalid date format")

    # 3. Store in DB (UploadedData)
    # Convert dates to string for JSON serialization
    data_json = df.copy()
    data_json['date'] = data_json['date'].dt.strftime('%Y-%m-%d')
    records = data_json.to_dict(orient='records')
    
    # Check if user already uploaded today? (Skip for MVP simplicity or handle unique constraint)
    new_upload = UploadedData(
        user_id=current_user.id,
        file_name=file.filename,
        data=records,
        n_rows=len(df)
    )
    db.add(new_upload)
    db.flush() # get ID
    
    # 4. ML Process
    predictor = CrystalBallPredictor()
    predictor.fit(df)
    predictions = predictor.predict(n_days=7)
    stats = predictor.get_model_stats()
    
    # 5. Save Predictions
    for p in predictions:
        pred_entry = Prediction(
            user_id=current_user.id,
            uploaded_data_id=new_upload.id,
            prediction_date=datetime.strptime(p['date'], '%Y-%m-%d').date(),
            predicted_covers=p['predicted_covers'],
            confidence=p['confidence'],
            weather=p.get('weather') # Save weather
        )
        db.add(pred_entry)

    
    # 6. Save Model
    model_binary = predictor.save()
    new_model = MLModel(
        user_id=current_user.id,
        model_binary=model_binary,
        model_stats=stats
    )
    db.add(new_model)
    
    db.commit()
    
    return {
        "status": "success",
        "predictions": predictions,
        "model_stats": stats
    }
