from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .ml_engine import TimeSeriesForecaster, parse_csv_data, generate_forecast_response
import pandas as pd
from io import StringIO

app = FastAPI(title="CrystalBall API", version="1.0.0")

# CORS Configuration
from datetime import datetime
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://crystal-ball.app,
    "https://crystalball-frontend.onrender.com",
    "https://crystalball-frontend.onrender.com/"
    ]
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CrystalBall API v1.0 is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/predictions")
async def get_predictions():
    return []  # Empty array for now

@app.post("/predictions")
async def forecast_from_csv(request_data: dict):
    """Generate premium ML forecasts from uploaded CSV data"""
    try:
        csv_content = request_data.get('csv_content')
        if not csv_content:
            return {'error': 'CSV content required', 'status': 'error'}
        
        # Parse CSV
        df = parse_csv_data(csv_content)
        
        # Detect date and value columns
        date_col = next((col for col in df.columns if 'date' in col.lower()), 'date')
        value_col = next((col for col in df.columns if 'amount' in col.lower() or 'value' in col.lower()), df.columns[1] if len(df.columns) > 1 else 'value')
        
        # Generate forecasts
        forecaster = TimeSeriesForecaster(df, date_col, value_col)
        predictions = forecaster.forecast(periods=30)
        insights = forecaster.get_insights()
        
        # Return formatted response
        return generate_forecast_response(predictions, insights)

    # Routes per gestione forecasts premium
@app.get("/health/detailed")
async def health_detailed():
    """Detailed health check with system info"""
    return {
        "status": "operational",
        "version": "2.0-premium",
        "features": ["ML-Forecasting", "Trend-Analysis", "Seasonality-Detection", "Confidence-Intervals"],
        "timestamp": datetime.now().isoformat()
    }
        
    except Exception as e:
        return {'error': str(e), 'status': 'error', 'message': 'Forecast generation failed'}
async def upload_csv(file: dict):
    return {"message": "CSV received", "status": "success"}
