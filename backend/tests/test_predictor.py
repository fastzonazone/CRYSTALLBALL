import pytest
import pandas as pd
from datetime import datetime, timedelta
from app.ml.predictor import CrystalBallPredictor

@pytest.fixture
def sample_data():
    # Create a simple dataset of 30 days with a slight upward trend
    dates = pd.date_range(start='2023-01-01', periods=30)
    covers = [100 + i * 2 for i in range(30)]  # linear increase
    df = pd.DataFrame({"date": dates, "covers": covers})
    return df

def test_fit_and_predict(sample_data):
    predictor = CrystalBallPredictor()
    predictor.fit(sample_data)
    # Verify internal stats are set
    assert predictor.n_samples == 30
    assert predictor.mean_covers > 0
    # Predict next 5 days
    preds = predictor.predict(n_days=5)
    assert len(preds) == 5
    for p in preds:
        # Each prediction should have required keys
        assert "date" in p
        assert "predicted_covers" in p
        assert "confidence" in p
        assert isinstance(p["predicted_covers"], int)
        assert isinstance(p["confidence"], float)
        # Confidence should be within reasonable bounds
        assert 50 <= p["confidence"] <= 95

def test_weather_adjustment(sample_data, monkeypatch):
    # Mock WeatherService to control output
    class MockWeather:
        @staticmethod
        def get_forecast(date):
            return "Rainy" if date.weekday() == 5 else "Sunny"
        @staticmethod
        def get_rain_penalty(weather):
            return 0.8 if weather == "Rainy" else 1.0
    monkeypatch.setattr('app.ml.predictor.WeatherService', MockWeather)
    predictor = CrystalBallPredictor()
    predictor.fit(sample_data)
    preds = predictor.predict(n_days=3)
    # Ensure rain penalty applied on Saturday (weekday 5)
    for p in preds:
        if p["weather"] == "Rainy":
            # Predicted covers should be reduced compared to non‑rainy days
            assert p["predicted_covers"] < predictor.mean_covers * 1.5
        else:
            assert p["predicted_covers"] >= predictor.mean_covers
