"""ML Engine for financial forecasting - Premium quality predictions"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from dataclasses import dataclass
import json

@dataclass
class Prediction:
    """Premium prediction result structure"""
    date: str
    value: float
    lower_bound: float  # -95% confidence
    upper_bound: float  # +95% confidence
    confidence: float   # 0-1 score
    
    def to_dict(self) -> Dict:
        return {
            'date': self.date,
            'value': round(self.value, 2),
            'lower_bound': round(self.lower_bound, 2),
            'upper_bound': round(self.upper_bound, 2),
            'confidence': round(self.confidence, 3)
        }

class TimeSeriesForecaster:
    """Industrial-grade time series forecasting engine"""
    
    def __init__(self, data: pd.DataFrame, date_column: str = 'date', value_column: str = 'value'):
        self.df = data.copy()
        self.df[date_column] = pd.to_datetime(self.df[date_column])
        self.df = self.df.sort_values(date_column)
        self.date_col = date_column
        self.value_col = value_column
        self.values = self.df[value_column].values
        self.dates = self.df[date_column].values
        
    def calculate_trend(self) -> float:
        """Calculate overall trend using linear regression"""
        X = np.arange(len(self.values)).reshape(-1, 1)
        n = len(self.values)
        x_mean = np.mean(X)
        y_mean = np.mean(self.values)
        slope = np.sum((X.flatten() - x_mean) * (self.values - y_mean)) / np.sum((X.flatten() - x_mean) ** 2)
        return float(slope)
    
    def detect_seasonality(self, period: int = 7) -> Tuple[float, bool]:
        """Detect seasonal patterns (e.g., weekly cycles)"""
        if len(self.values) < period * 2:
            return 0.0, False
        
        seasonal_values = self.values[-period*2:]
        first_half = np.mean(seasonal_values[:period])
        second_half = np.mean(seasonal_values[period:])
        seasonality_strength = abs(second_half - first_half) / np.mean(self.values)
        has_seasonality = seasonality_strength > 0.05
        return float(seasonality_strength), has_seasonality
    
    def calculate_volatility(self) -> float:
        """Calculate price volatility (standard deviation)"""
        returns = np.diff(self.values) / self.values[:-1]
        return float(np.std(returns))
    
    def forecast(self, periods: int = 30) -> List[Prediction]:
        """Generate premium forecasts with confidence intervals"""
        trend = self.calculate_trend()
        seasonality_strength, has_seasonality = self.detect_seasonality(7)
        volatility = self.calculate_volatility()
        
        last_value = self.values[-1]
        last_date = pd.to_datetime(self.dates[-1])
        
        predictions = []
        
        for i in range(1, periods + 1):
            # Base forecast: last value + trend
            base_forecast = last_value + (trend * i)
            
            # Add seasonal component if detected
            if has_seasonality:
                seasonal_idx = (len(self.values) + i) % 7
                seasonal_component = seasonality_strength * last_value * (0.05 * np.sin(seasonal_idx))
            else:
                seasonal_component = 0
            
            # Calculate confidence interval based on volatility
            forecast_value = base_forecast + seasonal_component
            # Confidence decreases with forecast horizon
            horizon_factor = 1 - (i / periods) * 0.3
            std_error = volatility * last_value * np.sqrt(i) * horizon_factor
            
            lower = forecast_value - (1.96 * std_error)  # 95% CI
            upper = forecast_value + (1.96 * std_error)
            
            # Confidence score (higher = more reliable)
            confidence = max(0.5, min(1.0, horizon_factor * (1 - volatility)))
            
            pred_date = last_date + timedelta(days=i)
            predictions.append(Prediction(
                date=pred_date.strftime('%Y-%m-%d'),
                value=max(0, forecast_value),  # Prevent negative values
                lower_bound=max(0, lower),
                upper_bound=upper,
                confidence=confidence
            ))
        
        return predictions
    
    def get_insights(self) -> Dict:
        """Generate human-readable insights from data"""
        trend = self.calculate_trend()
        seasonality_strength, has_seasonality = self.detect_seasonality()
        volatility = self.calculate_volatility()
        
        trend_direction = "📈 up" if trend > 0 else "📉 down"
        trend_percent = abs(trend) / np.mean(self.values) * 100 if np.mean(self.values) > 0 else 0
        
        return {
            'trend': trend_direction,
            'trend_strength_percent': round(trend_percent, 2),
            'has_seasonality': has_seasonality,
            'seasonality_strength': round(seasonality_strength * 100, 1),
            'volatility': round(volatility * 100, 2),
            'risk_level': 'High' if volatility > 0.2 else 'Medium' if volatility > 0.1 else 'Low',
            'avg_value': round(np.mean(self.values), 2),
            'max_value': round(np.max(self.values), 2),
            'min_value': round(np.min(self.values), 2)
        }

def parse_csv_data(csv_content: str) -> pd.DataFrame:
    """Parse CSV content safely"""
    from io import StringIO
    try:
        df = pd.read_csv(StringIO(csv_content))
        return df
    except Exception as e:
        raise ValueError(f"CSV parsing error: {str(e)}")

def generate_forecast_response(predictions: List[Prediction], insights: Dict) -> Dict:
    """Format response as premium API output"""
    return {
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'insights': insights,
        'forecast': [p.to_dict() for p in predictions],
        'metadata': {
            'forecast_length': len(predictions),
            'confidence_avg': round(np.mean([p.confidence for p in predictions]), 3),
            'model_version': '2.0-premium'
        }
    }
