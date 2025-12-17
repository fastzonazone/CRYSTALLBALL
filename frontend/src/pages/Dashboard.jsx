import React, { useState } from 'react';
import { Upload, TrendingUp, Zap, BarChart3, Activity } from 'lucide-react';

const Dashboard = () => {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">CrystalBall Dashboard 🔮</h1>
        <p className="text-gray-600">Analizza i pattern dei tuoi dati di cassa</p>
      </div>

      {/* Stats Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Trend Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-semibold mb-1">Trend Rilevato</p>
              <p className="text-4xl font-bold text-blue-600">+2.5%</p>
            </div>
            <TrendingUp className="w-16 h-16 text-blue-300 opacity-75" />
          </div>
        </div>

        {/* Seasonality Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-semibold mb-1">Stagionalità</p>
              <p className="text-4xl font-bold text-purple-600">Rilevata</p>
            </div>
            <Activity className="w-16 h-16 text-purple-300 opacity-75" />
          </div>
        </div>

        {/* Data Loaded Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-emerald-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-semibold mb-1">Dati Caricati</p>
              <p className="text-4xl font-bold text-emerald-600">{hasData ? '✓' : '–'}</p>
            </div>
            <Zap className="w-16 h-16 text-emerald-300 opacity-75" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!hasData ? (
        /* Welcome State */
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-12 rounded-3xl shadow-xl border border-blue-100 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benvenuto in CrystalBall! 🎯</h2>
            <p className="text-lg text-gray-600 mb-8">
              La tua bolla di cristallo per ristoranti gourmet. Carica i dati storici della tua cassa e scopri i pattern nascosti.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-blue-100">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Carica dati storici</p>
                  <p className="text-sm text-gray-600">(ultimi 12 mesi)</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-purple-100">
                <span className="text-2xl">🔍</span>
                <div>
                  <p className="font-semibold text-gray-900">Scopri trend</p>
                  <p className="text-sm text-gray-600">e stagionalità</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-emerald-100">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="font-semibold text-gray-900">Ottieni previsioni</p>
                  <p className="text-sm text-gray-600">accurate</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white p-4 rounded-xl border border-rose-100">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-gray-900">Pianifica strategie</p>
                  <p className="text-sm text-gray-600">basate su dati</p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-2">📁 Carica il tuo CSV</h3>
              <p className="text-blue-100 mb-6">Formato: data, coperti, importo (Excel/CSV)</p>
              <button
                onClick={() => setHasData(true)}
                className="w-full bg-white text-blue-600 font-semibold py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Carica File
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Data Display State */
        <div className="max-w-6xl mx-auto">
          {/* Forecast Chart Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Previsioni 7 Giorni</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-2xl text-center border-2 border-dashed border-blue-200">
              <p className="text-xl text-gray-600">📊 Grafico previsioni</p>
              <p className="text-sm text-gray-500 mt-2">(Backend ML engine in fase di configurazione)</p>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Trend Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-200">
              <h4 className="text-xl font-bold text-blue-900 mb-4">📈 Trend Analysis</h4>
              <p className="text-gray-700">I tuoi dati mostrano una crescita costante del 2-3% al mese</p>
            </div>

            {/* Seasonality */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg border border-purple-200">
              <h4 className="text-xl font-bold text-purple-900 mb-4">📅 Stagionalità</h4>
              <p className="text-gray-700">Picchi nei fine settimana, cali nei giorni feriali</p>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setHasData(false)}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-lg"
          >
            ← Torna al caricamento
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
