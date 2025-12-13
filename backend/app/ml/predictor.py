import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from datetime import timedelta
import joblib
import io

class CrystalBallPredictor:
    """
    Simple ML Predictor for restaurant covers (customer count) forecast.
    Uses seasonal decomposition + trend + weather adjustment.
    """
    
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.daily_means = {}  # mean covers per day of week
        self.trend = 0  # trend coefficient (covers per day)
        self.seasonality = {}  # day-of-week seasonality factor
        self.last_date = None
        self.mean_covers = 0
        self.std_covers = 0
        self.n_samples = 0
    
    def fit(self, df):
        """
        Train the predictor on historical data.
        Input df: pandas DataFrame with columns [date, covers]
        df['date'] must be datetime
        """
        self.n_samples = len(df)
        
        # 1) Add time-based features
        df = df.copy()
        df['day_of_week'] = df['date'].dt.dayofweek  # 0=Mon, 6=Sun
        df['week_of_year'] = df['date'].dt.isocalendar().week
        df['month'] = df['date'].dt.month
        df['day_num'] = (df['date'] - df['date'].min()).dt.days
        
        # 2) Baseline: average covers per day-of-week
        self.daily_means = df.groupby('day_of_week')['covers'].mean().to_dict()
        
        # 3) Calculate trend (simple linear regression)
        X_trend = df[['day_num']].values
        y_trend = df['covers'].values
        trend_model = LinearRegression()
        trend_model.fit(X_trend, y_trend)
        self.trend = trend_model.coef_[0]  # covers change per day
        
        # 4) Seasonality: ratio of actual to moving average
        df['ma_30'] = df['covers'].rolling(window=30, min_periods=1).mean()
        df['seasonality_factor'] = df['covers'] / (df['ma_30'] + 1e-6)
        self.seasonality = df.groupby('day_of_week')['seasonality_factor'].mean().to_dict()
        
        # 5) Train model on features
        X = df[['day_of_week', 'week_of_year', 'month', 'day_num']].values
        y = df['covers'].values
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        
        self.last_date = df['date'].max()
        self.mean_covers = df['covers'].mean()
        self.std_covers = df['covers'].std()
    
    def predict(self, n_days=7):
        """
        Predict covers for the next n_days.
        Returns: list of dict {date, predicted_covers, confidence}
        """
        if self.last_date is None:
            return []  # Model not trained yet
        
        predictions = []
        current_date = self.last_date + timedelta(days=1)
        
        for i in range(n_days):
            pred_date = current_date + timedelta(days=i)
            
            # Extract features
            day_of_week = pred_date.weekday()
            week_of_year = pred_date.isocalendar().week
            month = pred_date.month
            day_num = (pred_date - self.last_date).days
            
            # Base prediction: day-of-week average
            base_val = self.daily_means.get(day_of_week, self.mean_covers)
            season_factor = self.seasonality.get(day_of_week, 1.0)
            pred_adjusted = base_val * season_factor
            
            # Add trend
            pred_trend = pred_adjusted + (self.trend * (i + 1))
            
            # Calculate confidence based on historical std
            confidence = max(50, 100 - (self.std_covers / (self.mean_covers + 1e-6) * 100))
            confidence = min(95, confidence)
            
            predictions.append({
                'date': pred_date.strftime('%Y-%m-%d'),
                'predicted_covers': int(round(max(0, pred_trend))),
                'confidence': round(confidence, 1)
            })
        
        return predictions
    
    def get_model_stats(self):
        """
        Return model statistics and performance metrics.
        """
        return {
            'n_samples': self.n_samples,
            'mean_covers': round(self.mean_covers, 1),
            'std_covers': round(self.std_covers, 1),
            'trend_per_day': round(self.trend, 3),
            'seasonality_detected': len(self.seasonality) > 0
        }
    
    def save(self):
        """
        Serialize the model to bytes for storage.
        """
        buffer = io.BytesIO()
        joblib.dump(self, buffer)
        return buffer.getvalue()
    
    @staticmethod
    def load(data):
        """
        Deserialize the model from bytes.
        """
        buffer = io.BytesIO(data)
        return joblib.load(buffer)
