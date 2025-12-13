import React from 'react';
import { cn } from '../utils/cn';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <div className={cn("glass-card p-5", className)} {...props}>
            {children}
        </div>
    );
};

export default GlassCard;
