import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import CrystalBall from '../components/CrystalBall';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary text-text-primary px-6 md:px-12 lg:px-24">

            {/* Subtle Ambient Background - No heavy blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-gradient-to-br from-accent-cyan/5 to-transparent rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

                {/* Text Content - Swiss Style Typography */}
                <div className="flex flex-col items-start space-y-10 text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-6xl md:text-8xl font-light tracking-tighter leading-[1] text-white">
                            Forecast. <br />
                            <span className="text-text-secondary">Precision.</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl md:text-2xl text-text-secondary max-w-lg font-light leading-relaxed tracking-tight"
                    >
                        The crystal ball for modern dining. Analyze patterns, predict demand, and optimize your restaurant with absolute clarity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Button
                            variant="primary"
                            className="rounded-full px-8 py-4 text-base bg-white text-black hover:bg-neutral-200 hover:scale-105 shadow-lg transition-all duration-300"
                        >
                            Start 30-day trial
                        </Button>
                    </motion.div>
                </div>

                {/* Visual Centerpiece */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-center lg:justify-end py-12 lg:py-0"
                >
                    <div className="relative transform hover:scale-[1.02] transition-transform duration-700">
                        <CrystalBall />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default LandingPage;
