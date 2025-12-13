import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import CrystalBall from '../components/CrystalBall';
import { PredictionChart } from '../components/PredictionChart';
import UploadCSV from '../components/UploadCSV';
import { motion } from 'framer-motion';
import { usePrediction } from '../hooks/usePrediction';

const Dashboard = () => {
    const { predictions, stats, loading, fetchPredictions, updateFromUpload } = usePrediction();

    // Get next day prediction for the Crystal Ball
    const nextPrediction = predictions.length > 0 ? predictions[0] : null;

    useEffect(() => {
        fetchPredictions();
    }, [fetchPredictions]);

    return (
        <div className="min-h-screen">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stat Card 1: Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 rounded-xl"
                    >
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">Trend Detected</h3>
                        <p className="text-2xl font-bold text-[#00d9ff]">
                            {stats?.trend_per_day ? `+${stats.trend_per_day.toFixed(1)} / day` : 'Analyzing...'}
                        </p>
                    </motion.div>

                    {/* Stat Card 2: 7 Day Growth */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-6 rounded-xl"
                    >
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">Cycle Confidence</h3>
                        <p className="text-2xl font-bold text-[#d946ef]">
                            {nextPrediction ? `${nextPrediction.confidence}%` : '--'}
                        </p>
                    </motion.div>

                    {/* Stat Card 3: Seasonality */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 rounded-xl"
                    >
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">Seasonality</h3>
                        <p className="text-2xl font-bold text-white">
                            {stats?.seasonality_detected ? 'Pattern Locked' : 'Searching...'}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Input & Crystal Ball */}
                    <section className="lg:col-span-1 space-y-8">
                        {/* Crystal Ball Visualization */}
                        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
                            <CrystalBall
                                prediction={nextPrediction?.predicted_covers}
                                confidence={nextPrediction?.confidence}
                                weather={nextPrediction?.weather}
                            />
                        </div>
                    </section>

                    {/* Right Column: Charts & Data */}
                    <section className="lg:col-span-2 space-y-8">
                        {/* Main Chart */}
                        <div className="glass-panel p-6 rounded-2xl h-[400px]">
                            <h3 className="text-lg font-light mb-6 border-b border-[#ffffff10] pb-2">7-Day Forecast Horizon</h3>
                            <PredictionChart data={predictions} />
                        </div>

                        {/* Upload Area */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-light mb-6 border-b border-[#ffffff10] pb-2">Data Ingestion</h3>
                            <UploadCSV onUploadSuccess={updateFromUpload} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
