import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PricingPage from './pages/PricingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-gray-800 text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
