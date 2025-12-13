import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PredictionChart = ({ data }) => {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#000000cc', borderColor: '#00d9ff', color: '#fff' }}
                        itemStyle={{ color: '#00d9ff' }}
                    />
                    {/* Actual Data (Verified) - Dashed White */}
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#ffffff"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                        name="Actual (Verified)"
                    />
                    {/* Prediction (AI) - Cyan */}
                    <Area
                        type="monotone"
                        dataKey="predicted_covers"
                        stroke="#00d9ff"
                        fill="url(#colorPredicted)"
                        strokeWidth={2}
                        name="Predicted (AI)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
