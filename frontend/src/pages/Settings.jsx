import React from 'react';
import { Header } from '../components/Header';
import { PricingTable } from '../components/PricingTable';

export const Settings = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-light mb-8 border-b border-[#ffffff10] pb-4">
                    Subscription Plan
                </h2>
                <PricingTable />

                <div className="mt-12 p-8 glass-panel rounded-xl">
                    <h3 className="text-lg font-bold mb-4">Account Settings</h3>
                    <p className="text-gray-400">Data retention: 12 months</p>
                    <p className="text-gray-400">Email: chef@restaurant.com</p>
                </div>
            </div>
        </div>
    );
};
