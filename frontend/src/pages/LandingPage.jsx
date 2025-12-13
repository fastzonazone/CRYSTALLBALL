import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import CrystalBall from '../components/CrystalBall';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 text-gray-900 px-6 md:px-12 lg:px-24">
      {/* Background Gradients/Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        {/* Text Content */}
        <div className="flex flex-col items-start space-y-8 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-gray-900"
          >
            Predici il futuro <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              dei tuoi tavoli
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-xl text-gray-600 max-w-xl font-regular leading-relaxed"
          >
            Analizza gli ultimi 12 mesi della tua cassa,
            scopri i pattern nascosti, pianifica con certezza.
            La bolla di cristallo per ristoranti gourmet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Button
              onClick={handleStartTrial}
              className="px-8 py-4 text-base shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer"
            >
              Inizia gratis per 30 giorni
            </Button>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
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
