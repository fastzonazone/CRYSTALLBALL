import React from 'react';
import { cn } from '../utils/cn';

const Button = ({
    children,
    variant = 'primary',
    className,
    isLoading = false,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 ease-apple-ease disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "btn-primary", // mapped to @apply in index.css for cleaner HTML
        secondary: "btn-secondary",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
