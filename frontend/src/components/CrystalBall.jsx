import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Cloud } from 'lucide-react';

export const CrystalBall = ({ prediction, confidence, weather }) => {

    const getWeatherIcon = (w) => {
        if (w === 'Rainy') return <CloudRain className="text-[#00d9ff]" size={20} />;
        if (w === 'Cloudy') return <Cloud className="text-gray-400" size={20} />;
        return <Sun className="text-yellow-400" size={20} />;
    };

    return (
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Outer Glow / Glass Effect */}
            <motion.div
                className={`absolute inset-0 rounded-full blur-xl ${weather === 'Rainy' ? 'bg-gradient-to-br from-[#00d9ff44] to-[#0055ff44]' : 'bg-gradient-to-br from-[#00d9ff44] to-[#8f5ff844]'}`}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* The Ball */}
            <div className="relative w-full h-full rounded-full border border-white/10 bg-black/40 backdrop-blur-sm shadow-[inset_0_0_50px_rgba(0,217,255,0.2)] flex items-center justify-center overflow-hidden">

                {/* Rotating Rings */}
                <motion.div
                    className="absolute inset-2 rounded-full border border-[#00d9ff]/30 border-t-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-8 rounded-full border border-[#8f5ff8]/30 border-b-transparent border-r-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Content */}
                <div className="text-center z-20">
                    {prediction ? (
                        <>
                            <h1
                                className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00d9ff] to-[#fff]"
                            >
                                {prediction}
                            </h1>

                            <div className="flex items-center justify-center gap-2 mt-2">
                                {weather && getWeatherIcon(weather)}
                                <span className="text-gray-400 text-sm font-mono uppercase tracking-widest">
                                    {weather || 'Forecast'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <span className="font-mono text-6xl font-semibold text-[#00d9ff] tracking-tighter drop-shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                                #
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrystalBall;
