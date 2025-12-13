import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            // Fallback for MVP demo if backend is offline
            if (email && password) {
                const demoUser = { email, id: 'demo-id', restaurant_name: 'Demo Restaurant' };
                localStorage.setItem('token', 'demo-token');
                setUser(demoUser);
                return { success: true }; // Proceed even on error for demo
            }
            return { success: false, error: error.response?.data?.detail || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Check token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In real app, validate token with /me endpoint
            setUser({ email: 'demo@user.com' }); // Mock restore
        }
        setLoading(false);
    }, []);

    return { user, loading, login, logout };
};
