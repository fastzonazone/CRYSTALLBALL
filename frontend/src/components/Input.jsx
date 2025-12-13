import React from 'react';
import { cn } from '../utils/cn';

const Input = React.forwardRef(({ className, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <input
                ref={ref}
                className={cn(
                    "glass-input w-full",
                    error && "border-accent-pink focus:border-accent-pink focus:shadow-[0_0_0_3px_rgba(255,0,110,0.15)]",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-accent-pink ml-1">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
