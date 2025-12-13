import random
from datetime import date

class WeatherService:
    @staticmethod
    def get_forecast(target_date: date):
        """
        Returns a deterministic weather condition based on the date hash.
        Possibilities: 'Sunny', 'Rainy', 'Cloudy'
        """
        # Deterministic seed based on date so it doesn't change on reload
        seed = target_date.toordinal()
        random.seed(seed)
        
        r = random.random()
        if r < 0.2:
            return "Rainy"
        elif r < 0.5:
            return "Cloudy"
        else:
            return "Sunny"

    @staticmethod
    def get_rain_penalty(condition: str):
        if condition == "Rainy":
            return 0.8 # -20% covers
        return 1.0
