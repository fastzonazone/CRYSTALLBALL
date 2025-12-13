import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import CrystalBall from '../components/CrystalBall';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary text-text-primary px-6 md:px-12 lg:px-24">

            {/* Background Gradients/Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">

                {/* Text Content */}
                <div className="flex flex-col items-start space-y-8 text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1]"
                    >
                        Predici il futuro <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            dei tuoi tavoli
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-text-secondary max-w-xl font-regular leading-relaxed"
                    >
                        Analizza gli ultimi 12 mesi della tua cassa,
                        scopri i pattern nascosti, pianifica con certezza.
                        La bolla di cristallo per ristoranti gourmet.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <Button
                            variant="primary"
                            className="px-8 py-4 text-base shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:shadow-[0_0_60px_rgba(0,217,255,0.5)]"
                        >
                            Inizia gratis per 30 giorni
                        </Button>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="flex justify-center lg:justify-end py-12 lg:py-0"
                >
                    <div className="relative">
                        <CrystalBall />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default LandingPage;
