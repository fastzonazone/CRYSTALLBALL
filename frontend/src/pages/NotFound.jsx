import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#00d9ff] to-transparent opacity-50">
                404
            </h1>
            <h2 className="text-2xl font-bold mt-4">Signal Lost</h2>
            <p className="text-gray-400 mt-2 mb-8">We cannot predict where this page is.</p>

            <Link
                to="/dashboard"
                className="px-6 py-3 rounded-full border border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff] hover:text-black transition-all"
            >
                Return to Mission Control
            </Link>
        </div>
    );
};
