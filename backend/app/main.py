from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .ml_engine import TimeSeriesForecaster, parse_csv_data, generate_forecast_response
import pandas as pd
from io import StringIO
from .services.stripe_service import StripeService
import os
from .middleware import rate_limit_middleware, logging_middleware, error_handler_middleware

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

# Phase 4: Add Production Hardening Middleware
app.add_middleware(error_handler_middleware)
app.add_middleware(logging_middleware)
app.add_middleware(rate_limit_middleware)

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

# ============================================================================
# STRIPE PAYMENT INTEGRATION ROUTES
# ============================================================================

stripe_service = StripeService(os.getenv('STRIPE_SECRET_KEY', ''))

@app.post("/create-checkout")
async def create_checkout(request_data: dict):
        """Create a Stripe checkout session for premium subscription"""
        try:
                    plan = request_data.get('plan', 'pro')
                    session = stripe_service.create_checkout_session(plan=plan)
                    return {'session_id': session.id, 'url': session.url, 'status': 'success'}
                except Exception as e:
                            return {'error': str(e), 'status': 'error', 'message': 'Checkout session creation failed'}

@app.post("/stripe/webhook")
async def stripe_webhook(request_data: dict):
        """Handle Stripe webhook events"""
        try:
                    return {'status': 'success', 'message': 'Webhook received'}
                except Exception as e:
                            return {'error': str(e), 'status': 'error', 'message': 'Webhook verification failed'}

@app.post("/subscription/status")
async def get_subscription_status(request_data: dict):
        """Get subscription status for a customer"""
        try:
                    customer_id = request_data.get('customer_id')
                    status = stripe_service.get_subscription_status(customer_id)
                    return {'status': status, 'message': 'Subscription status retrieved'}
                except Exception as e:
                            return {'error': str(e), 'status': 'error', 'message': 'Failed to retrieve subscription status'}
