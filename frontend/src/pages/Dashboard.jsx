import React, { useState } from 'react';
import { Upload, TrendingUp, Zap } from 'lucide-react';

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
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Trend Rilevato</p>
              <p className="text-3xl font-bold text-blue-600">+2.5%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Stagionalità</p>
              <p className="text-3xl font-bold text-purple-600">Rilevata</p>
            </div>
            <Zap className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dati Caricati</p>
              <p className="text-3xl font-bold text-emerald-600">{hasData ? '✓' : '–'}</p>
            </div>
            <Upload className="w-12 h-12 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {!hasData ? (
          /* Welcome State */
          <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benvenuto in CrystalBall! 🎯</h2>
              <p className="text-lg text-gray-600 mb-8">
                La tua bolla di cristallo per ristoranti gourmet. Carica i dati storici della tua cassa e scopri i pattern nascosti.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <span className="text-gray-700">Carica dati storici (ultimi 12 mesi)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  <span className="text-gray-700">Scopri trend e stagionalità</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <span className="text-gray-700">Ottieni previsioni accurate</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-700">Pianifica strategie basate su dati</span>
                </div>
              </div>

              {/* Upload Section */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-xl text-white">
                <h3 className="text-2xl font-semibold mb-4">📁 Carica il tuo CSV</h3>
                <p className="text-blue-100 mb-6">Formato: data, coperti, importo (Excel/CSV)</p>
                <button
                  onClick={() => setHasData(true)}
                  className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Carica File
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Data Display State */
          <div className="space-y-8">
            {/* Forecast Chart Placeholder */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Previsioni 7 Giorni</h3>
              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">📊 Grafico previsioni</p>
                  <p className="text-sm text-gray-500">(Backend ML engine in fase di configurazione)</p>
                </div>
              </div>
            </div>

            {/* Insights Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Trend Analysis</h4>
                <p className="text-gray-600">I tuoi dati mostrano una crescita costante del 2-3% al mese</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Stagionalità</h4>
                <p className="text-gray-600">Picchi nei fine settimana, cali nei giorni feriali</p>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => setHasData(false)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Torna al caricamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
