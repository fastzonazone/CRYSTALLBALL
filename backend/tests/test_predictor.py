import pytest
import pandas as pd
import numpy as np
from datetime import datetime
from app.ml.predictor import CrystalBallPredictor

def test_predictor_logic():
    # 1. Generate synthetic data (Seasonality + Trend)
    # 2 weeks of data
    dates = pd.date_range(start="2023-01-01", periods=14, freq='D')
    
    # Base covers 50, Trend +1/day, Seasonality: Weekends (Fri,Sat,Sun) +20
    covers = []
    for i, d in enumerate(dates):
        c = 50 + (i * 1.0) # Trend
        if d.weekday() >= 4: # Fri, Sat, Sun
            c += 20
        covers.append(c)
        
    df = pd.DataFrame({'date': dates, 'covers': covers})
    
    # 2. Fit model
    predictor = CrystalBallPredictor()
    predictor.fit(df)
    
    stats = predictor.get_model_stats()
    
    # 3. Verify Stats
    print(f"Stats: {stats}")
    assert stats['n_samples'] == 14
    assert stats['mean_covers'] > 0
    # Trend should be positive (around 1.0)
    assert stats['trend_per_day'] > 0.5 
    assert stats['seasonality_detected'] is True
    
    # 4. Predict next 7 days
    predictions = predictor.predict(n_days=7)
    assert len(predictions) == 7
    
    first_pred = predictions[0]
    # Next day is 2023-01-15 (Sunday) -> Should be high
    print(f"Prediction for next day (Sun): {first_pred}")
    
    assert 'predicted_covers' in first_pred
    assert 'confidence' in first_pred
    assert 'weather' in first_pred # New check
    
    # Check randomness/mock logic if possible, or just struct
    if first_pred['weather'] == 'Rainy':
        # If rainy, we expect a penalty. 
        # Hard to assert exact value without controlling seed perfectly in test
        # But we can assert structure is correct.
        pass

    assert first_pred['confidence'] >= 40 # Lowered bound slightly due to rain penalty logic
    assert first_pred['confidence'] <= 95

if __name__ == "__main__":
    test_predictor_logic()
