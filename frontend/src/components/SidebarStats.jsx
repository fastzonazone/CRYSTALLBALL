import React from 'react';
import GlassCard from './GlassCard';
import { TrendingUp, Users, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, confidence, color = 'text-accent-cyan' }) => (
    <GlassCard className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
            <Icon size={20} className="text-accent-cyan" />
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 ${confidence > 80 ? 'text-accent-mint' :
                    confidence > 60 ? 'text-accent-cyan' : 'text-accent-pink'
                }`}>
                {confidence}% conf.
            </span>
        </div>
        <div>
            <span className="text-sm text-text-secondary block mb-1">{label}</span>
            <span className={`text-2xl font-light font-sans tracking-tight text-text-primary`}>
                {value}
            </span>
        </div>
    </GlassCard>
);

const SidebarStats = () => {
    return (
        <div className="flex flex-col gap-4">
            <StatCard
                icon={Users}
                label="Media Coperti"
                value="42"
                confidence={85}
            />
            <StatCard
                icon={TrendingUp}
                label="Trend Settimanale"
                value="+12%"
                confidence={65}
            />
            <StatCard
                icon={Calendar}
                label="Prossimo Evento"
                value="San Valentino"
                confidence={92}
            />
        </div>
    );
};

export default SidebarStats;
