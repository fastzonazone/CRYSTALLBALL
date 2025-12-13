import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import CrystalBall from '../components/CrystalBall';
import { PredictionChart } from '../components/PredictionChart';
import UploadCSV from '../components/UploadCSV';
import { motion } from 'framer-motion';
import { usePrediction } from '../hooks/usePrediction';

const Dashboard = () => {
  const { predictions, stats, loading, fetchPredictions, updateFromUpload } = usePrediction();
  const nextPrediction = predictions.length > 0 ? predictions[0] : null;

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const StatCard = ({ icon, label, value, color, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} p-6 rounded-2xl shadow-lg border border-opacity-20 hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1 tracking-wide">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`text-3xl ${color} opacity-30`}>{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon="📈"
            label="Trend Detected"
            value={stats?.trend_per_day ? `+${stats.trend_per_day.toFixed(1)}/day` : 'Analyzing...'}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon="🎯"
            label="Cycle Confidence"
            value={nextPrediction ? `${nextPrediction.confidence}%` : '--'}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon="🔄"
            label="Seasonality"
            value={stats?.seasonality_detected ? 'Pattern Locked' : 'Searching...'}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Crystal Ball */}
          <section className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col items-center justify-center min-h-[500px]"
            >
              <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Next Day Prediction</h3>
                <CrystalBall
                  prediction={nextPrediction?.predicted_covers}
                  confidence={nextPrediction?.confidence}
                  weather={nextPrediction?.weather}
                />
              </div>
            </motion.div>
          </section>

          {/* Right Column: Charts & Data */}
          <section className="lg:col-span-2 space-y-8">
            {/* Forecast Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="mb-6 pb-6 border-b-2 border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">7-Day Forecast Horizon</h3>
                <p className="text-sm text-gray-500 mt-1">Predicted covers for upcoming week</p>
              </div>
              <div className="h-80">
                <PredictionChart data={predictions} />
              </div>
            </motion.div>

            {/* Data Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-lg text-white"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">📊 Data Ingestion</h3>
                <p className="text-blue-100 text-sm">Upload your CSV data to train the prediction model</p>
              </div>
              <UploadCSV onUploadSuccess={updateFromUpload} />
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
