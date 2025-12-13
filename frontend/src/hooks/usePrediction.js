import { useState, useCallback } from 'react';
import api from '../services/api';

export const usePrediction = () => {
    const [predictions, setPredictions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mockData = [
        { date: '2023-12-14', predicted_covers: 45, confidence: 85, weather: 'Sunny', actual: 48 },
        { date: '2023-12-15', predicted_covers: 52, confidence: 80, weather: 'Cloudy', actual: 50 },
        { date: '2023-12-16', predicted_covers: 68, confidence: 75, weather: 'Rainy', actual: 60 },
        { date: '2023-12-17', predicted_covers: 70, confidence: 78, weather: 'Rainy' },
        { date: '2023-12-18', predicted_covers: 40, confidence: 90, weather: 'Sunny' },
        { date: '2023-12-19', predicted_covers: 42, confidence: 88, weather: 'Sunny' },
        { date: '2023-12-20', predicted_covers: 48, confidence: 85, weather: 'Cloudy' },
    ];

    const fetchPredictions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/predict/latest');
            if (res.data.predictions && res.data.predictions.length > 0) {
                setPredictions(res.data.predictions);
                setStats(res.data.stats);
            } else {
                // If DB empty (or auth failed silently), use mock data for demo
                console.warn("Using mock data due to empty response");
                setPredictions(mockData);
                setStats({ mean_covers: 50, trend_per_day: 1.2, seasonality_detected: true });
            }
        } catch (err) {
            console.warn("API Error, using mock data for demo", err);
            setPredictions(mockData);
            setStats({ mean_covers: 50, trend_per_day: 1.2, seasonality_detected: true });
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFromUpload = (data) => {
        if (data.predictions) {
            setPredictions(data.predictions);
            setStats(data.model_stats);
        }
    };

    return { predictions, stats, loading, error, fetchPredictions, updateFromUpload };
};
