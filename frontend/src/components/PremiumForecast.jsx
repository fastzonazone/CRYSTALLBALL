import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PremiumForecast = ({ data, insights }) => {
  if (!data || data.length === 0) {
    return (
      <div className="premium-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>Upload dati per previsioni</h2>
          <p>Carica il tuo file CSV per iniziare l'analisi predittiva</p>
        </div>
      </div>
    );
  }

  const trendColor = insights?.trend?.includes('up') ? '#10b981' : '#ef4444';
  const riskColor = insights?.risk_level === 'Low' ? '#10b981' : insights?.risk_level === 'Medium' ? '#f59e0b' : '#ef4444';

  return (
    <div className="premium-forecast">
      {/* Header Premium */}
      <div className="forecast-header">
        <h1>💎 Previsioni Premium</h1>
        <p className="subtitle">Analisi ML avanzata con confidence intervals</p>
      </div>

      {/* Grid Insights */}
      <div className="insights-grid">
        <InsightCard 
          icon="📈" 
          label="Trend" 
          value={insights?.trend}
          color={trendColor}
        />
        <InsightCard 
          icon="⚡" 
          label="Volatilità" 
          value={insights?.volatility?.toFixed(2) + '%'}
          color={riskColor}
        />
        <InsightCard 
          icon="🎯" 
          label="Livello Rischio" 
          value={insights?.risk_level}
          color={riskColor}
        />
        <InsightCard 
          icon="📊" 
          label="Media" 
          value={'€ ' + insights?.avg_value?.toFixed(2)}
          color="#06b6d4"
        />
      </div>

      {/* Chart Premium */}
      <div className="forecast-chart">
        <h2>Previsioni 30 Giorni</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => `€ ${value.toFixed(2)}`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorForecast)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Stats */}
      <div className="confidence-stats">
        <div className="stat-item">
          <span>Min Previsione</span>
          <strong>€ {Math.min(...data.map(d => d.lower_bound)).toFixed(2)}</strong>
        </div>
        <div className="stat-item">
          <span>Max Previsione</span>
          <strong>€ {Math.max(...data.map(d => d.upper_bound)).toFixed(2)}</strong>
        </div>
        <div className="stat-item">
          <span>Confidence Media</span>
          <strong>{(data.reduce((a, b) => a + b.confidence, 0) / data.length * 100).toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ icon, label, value, color }) => (
  <div className="insight-card">
    <div className="insight-icon">{icon}</div>
    <div className="insight-content">
      <p className="insight-label">{label}</p>
      <p className="insight-value" style={{ color }}>{value}</p>
    </div>
  </div>
);

export default PremiumForecast;
