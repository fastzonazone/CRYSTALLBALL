import React from 'react';
import { Rocket, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="h-16 border-b border-border-subtle flex justify-between items-center bg-bg-primary/80 backdrop-blur-md sticky top-0 z-50 px-6">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,217,255,0.5)] transition-shadow duration-300">
                        <Rocket size={16} className="text-white fill-white" />
                    </div>
                </Link>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <h1 className="text-sm font-regular tracking-wide text-text-primary">
                    Il tuo ristorante
                </h1>
            </div>

            <nav className="hidden md:flex gap-8 text-sm text-text-secondary">
                <Link to="/dashboard" className="text-text-primary hover:text-accent-cyan transition-colors">Dashboard</Link>
                <Link to="/upload" className="hover:text-text-primary transition-colors">Upload</Link>
                <Link to="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
                <Link to="/settings" className="hover:text-text-primary transition-colors">Settings</Link>
            </nav>

            <div className="flex items-center gap-4">
                <button className="md:hidden text-text-primary">
                    <Menu size={24} />
                </button>
                <div className="w-8 h-8 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center text-xs text-text-secondary">
                    JD
                </div>
            </div>
        </header>
    );
};
