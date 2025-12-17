import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Cloud, Sparkles } from 'lucide-react';

export const CrystalBall = ({ prediction, confidence, weather }) => {

    const getWeatherIcon = (w) => {
        if (w === 'Rainy') return <CloudRain className="text-accent-cyan" size={18} />;
        if (w === 'Cloudy') return <Cloud className="text-text-secondary" size={18} />;
        return <Sun className="text-[#ffd700]" size={18} />;
    };

    return (
        <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
            {/* Ambient Glow - Subtle & Deep */}
            <motion.div
                className="absolute inset-0 rounded-full blur-[80px] bg-accent-cyan/10"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* The Sphere Container */}
            <div className="relative w-64 h-64 rounded-full border border-white/10 bg-gradient-to-tr from-white/5 to-white/0 backdrop-blur-md shadow-[inset_0_0_60px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden z-10">

                {/* Inner Caustics/Reflections */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_20px_rgba(255,255,255,0.1)] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                {/* Rotating Rings - Ultra Thin & Elegant */}
                <motion.div
                    className="absolute inset-4 rounded-full border-[0.5px] border-white/20 border-t-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-12 rounded-full border-[0.5px] border-white/10 border-b-transparent border-r-transparent opacity-70"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Content - Clean Typography */}
                <div className="relative z-20 text-center flex flex-col items-center gap-1">
                    {prediction ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-cyan/80 mb-1 block">
                                Forecast
                            </span>
                            <h2 className="text-5xl font-light tracking-tighter text-white drop-shadow-lg">
                                {prediction}
                            </h2>
                            <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                                {weather && getWeatherIcon(weather)}
                                <span className="text-xs font-medium text-text-secondary tracking-wide">
                                    {weather || 'Analyzing...'}
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Sparkles className="text-white/20" size={32} strokeWidth={1} />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrystalBall;
