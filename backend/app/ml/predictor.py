
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from datetime import timedelta
import joblib
import io

class CrystalBallPredictor:
    
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.daily_means = {}  # mean per day of week
        self.trend = 0
        self.seasonality = {}  # day-of-week factor
        self.last_date = None
        self.mean_covers = 0
        self.std_covers = 0
        self.n_samples = 0
        
    def fit(self, df):
        """
        Input df: pandas DataFrame con colonne [date, covers]
        df['date'] deve essere datetime
        """
        self.n_samples = len(df)
        
        # 1) Aggiungi features
        df = df.copy()
        df['day_of_week'] = df['date'].dt.dayofweek  # 0=Mon, 6=Sun
        df['week_of_year'] = df['date'].dt.isocalendar().week
        df['month'] = df['date'].dt.month
        df['day_num'] = (df['date'] - df['date'].min()).dt.days
        
        # 2) Baseline: media per day-of-week
        self.daily_means = df.groupby('day_of_week')['covers'].mean().to_dict()
        
        # 3) Calcola trend (regressione lineare semplice su covers vs day_num)
        X_trend = df[['day_num']].values
        y_trend = df['covers'].values
        trend_model = LinearRegression()
        trend_model.fit(X_trend, y_trend)
        self.trend = trend_model.coef_[0]  # covers per giorno
        
        # 4) Seasonality: rapporto tra actual e moving average
        df['ma_30'] = df['covers'].rolling(window=30, min_periods=1).mean()
        # Avoid division by zero
        df['seasonality_factor'] = df['covers'] / (df['ma_30'] + 1e-6) 
        self.seasonality = df.groupby('day_of_week')['seasonality_factor'].mean().to_dict()
        
        # 5) Train model su features
        X = df[['day_of_week', 'week_of_year', 'month', 'day_num']].values
        y = df['covers'].values
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        
        self.last_date = df['date'].max()
        self.mean_covers = df['covers'].mean()
        self.std_covers = df['covers'].std()
        
    def predict(self, n_days=7):
        """
        Predici i prossimi n_days
        Return: list di dict { date, predicted_covers, confidence }
        """
        
        predictions = []
        current_date = self.last_date + timedelta(days=1)
        
        for i in range(n_days):
            pred_date = current_date + timedelta(days=i)
            
            # Features
            day_of_week = pred_date.weekday()
            week_of_year = pred_date.isocalendar().week
            month = pred_date.month
            # Approximate day_num continuation
            # We use last_day_num + i + 1 as roughly correct for MVP linear trend
            # In a real scenario we'd track exact start date
            day_num = (pred_date - self.last_date).days + (self.last_date - self.last_date).days # Simplified
            # Actually, let's just use the trend directly as per prompt
            
            # Features for model (scaled)
            # We need to construct X similar to training.
            # Issue: day_num scaling. 
            # Workaround: Use trend coefficient directly on top of seasonality base?
            # The prompt suggested: pred_trend = pred_adjusted + (self.trend * i)
            # So we rely on that formula.
            
            # We predict base using model (ignoring day_num impact if we use manual trend add?)
            # Or we pass dummy day_num?
            # Let's pass 0 for day_num and rely on self.trend addition
            X_pred = np.array([[day_of_week, week_of_year, month, 0]])
            # This is imperfect but MVP compliant given the formula below
            
            # X_pred_scaled = self.scaler.transform(X_pred) 
            # Scaler expects fitted range. 
            
            # Let's stick to the SIMPLE implementation requested in prompt
            # "3) Calcola trend... 5) Train model... pred_trend = pred_adjusted + (self.trend * i)"
            
            # Re-implementation to match prompt EXACTLY
            # The prompt code had:
            # X_pred = np.array([[day_of_week, week_of_year, month, day_num]])
            # self.model.predict(...)
            
            pass 

        return self.predict_logic(n_days)

    # Adding Weather Service import
    # Note: In a real app we'd inject this, but for MVP we import directly or pass in
    # For simplicity, we'll assume the caller handles the weather adjustment OR we interpret it here.
    # The prompt asked to "Update ML Predictor to factor in 'rain_forecast'".
    # So we'll import it here.
    
    def predict(self, n_days=7):
        # We need to import inside method to avoid circular imports if any, 
        # or better, just import at top. But let's stick to modifying the class logic.
        from app.services.weather_service import WeatherService
        
        predictions = []
        current_date = self.last_date + timedelta(days=1)
        
        for i in range(n_days):
            pred_date = current_date + timedelta(days=i)
            
            day_of_week = pred_date.weekday()
            
            # Base Logic
            base_val = self.daily_means.get(day_of_week, self.mean_covers)
            season_factor = self.seasonality.get(day_of_week, 1.0)
            pred_adjusted = base_val * season_factor
            
            # Trend
            pred_trend = pred_adjusted + (self.trend * (i + 1)) 
            
            # --- NEW: Weather Adjustment ---
            # We cast to date object for the service
            weather = WeatherService.get_forecast(pred_date.date())
            weather_factor = WeatherService.get_rain_penalty(weather)
            
            pred_final = pred_trend * weather_factor
            
            confidence = max(50, 100 - (self.std_covers / (self.mean_covers + 1e-6) * 100))
            if weather == "Rainy":
                confidence -= 10 # Lower confidence on rainy days? Or maybe just impact covers.
                # Let's keep confidence roughly same but covers lower.
            
            confidence = min(95, confidence)
            
            predictions.append({
                'date': pred_date.strftime('%Y-%m-%d'),
                'predicted_covers': int(round(max(0, pred_final))),
                'confidence': round(confidence, 1),
                'weather': weather # Include weather in output
            })
            
        return predictions

    def get_model_stats(self):
        return {
            'n_samples': self.n_samples,
            'mean_covers': round(self.mean_covers, 1),
            'std_covers': round(self.std_covers, 1),
            'trend_per_day': round(self.trend, 3),
            'seasonality_detected': len(self.seasonality) > 0
        }

    def save(self):
        buffer = io.BytesIO()
        joblib.dump(self, buffer)
        return buffer.getvalue()

