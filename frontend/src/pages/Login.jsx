import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLocalLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Starfield (Simplified) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2613&auto=format&fit=crop')] bg-cover opacity-20 z-0"></div>

            <div className="z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block p-4 rounded-full bg-[#00d9ff]/10 mb-4 border border-[#00d9ff]/30 shadow-[0_0_30px_#00d9ff44]"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#00d9ff] blur-sm absolute"></div>
                        <div className="w-12 h-12 relative flex items-center justify-center text-2xl">🔮</div>
                    </motion.div>
                    <h1 className="text-4xl font-light tracking-[0.2em] font-mono">CRYSTAL BALL</h1>
                    <p className="text-gray-400 mt-2 text-xs uppercase tracking-widest">Predictive Analytics // Auth</p>
                </div>

                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleLogin}
                    className="glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-md"
                >
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Identifier</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                            placeholder="Ex: chef@restaurant.com"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00d9ff] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={localLoading}
                        className="w-full bg-[#00d9ff] text-black font-bold py-3 rounded-lg hover:bg-[#00b8d4] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {localLoading ? 'Authenticating...' : 'Initiate Sequence'}
                    </button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            className="text-gray-500 text-xs hover:text-[#00d9ff]"
                            onClick={() => {
                                setEmail('demo@user.com');
                                setPassword('demo');
                            }}
                        >
                            Initialize Demo Mode
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};
