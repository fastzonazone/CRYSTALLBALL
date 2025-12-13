import React from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';

export const PricingTable = () => {

    const handleSubscribe = async (plan) => {
        try {
            const res = await axios.post('http://localhost:8000/api/billing/create-checkout-session', { plan });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (e) {
            console.error("Billing error", e);
            alert("Billing system is in test mode. Backend not reachable.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-12">
            {/* Basic Plan */}
            <div className="glass-panel p-8 rounded-2xl border border-[#ffffff10] hover:border-[#00d9ff]/50 transition-all flex flex-col">
                <h3 className="text-xl text-gray-400 mb-2">Monthly Mission</h3>
                <div className="text-4xl font-bold mb-6">€19<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                    {['7-Day Forecast', 'Basic Trends', 'CSV Upload', 'Email Support'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-[#00d9ff]" /> {f}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => handleSubscribe('monthly')}
                    className="w-full py-3 rounded-lg border border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff] hover:text-black transition-all font-medium"
                >
                    Launch Monthly
                </button>
            </div>

            {/* Pro Plan */}
            <div className="glass-panel p-8 rounded-2xl border border-[#8f5ff8] relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-[#8f5ff8] text-white text-xs px-3 py-1 rounded-bl-lg font-bold">POPULAR</div>
                <h3 className="text-xl text-white mb-2">Yearly Voyage</h3>
                <div className="text-4xl font-bold mb-6">€190<span className="text-lg text-gray-500 font-normal">/yr</span></div>
                <p className="text-sm text-[#8f5ff8] mb-4">Save 2 months</p>
                <ul className="space-y-3 mb-8 flex-1">
                    {['All Monthly Features', 'Priority Support', 'Advanced Seasonality', 'Custom Export'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                            <Check size={16} className="text-[#8f5ff8]" /> {f}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => handleSubscribe('year')}
                    className="w-full py-3 rounded-lg bg-[#8f5ff8] text-white hover:bg-[#7a4bd6] shadow-[0_0_20px_rgba(143,95,248,0.4)] transition-all font-medium"
                >
                    Launch Yearly
                </button>
            </div>
        </div>
    );
};
