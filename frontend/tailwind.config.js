/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0f1419',   // Deep Space
                    secondary: '#1a1f2e', // Sidebar/Cards
                    tertiary: '#252d3d',  // Nested panels
                },
                accent: {
                    cyan: {
                        DEFAULT: '#00d9ff', // Primary action
                        hover: '#00a3c0',
                        active: '#005a6f',
                    },
                    purple: {
                        DEFAULT: '#8f5ff8', // High confidence
                        hover: '#6b4ec0',
                    },
                    pink: {
                        DEFAULT: '#ff006e', // Medium confidence
                        hover: '#c90054',
                    },
                    mint: {
                        DEFAULT: '#00e5b8', // Success
                        hover: '#00a880',
                    },
                },
                text: {
                    primary: '#e0e0e0',
                    secondary: '#a0a0a0',
                },
                border: {
                    subtle: 'rgba(255, 255, 255, 0.1)',
                    ultra: 'rgba(255, 255, 255, 0.05)',
                },
            },
            fontFamily: {
                sans: ['"Helvetica Now Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
            },
            boxShadow: {
                'glass-card': '0 8px 24px rgba(0, 0, 0, 0.15)',
                'glass-container': '0 4px 12px rgba(0, 0, 0, 0.1)',
                'glow': '0 0 20px rgba(0, 217, 255, 0.15), inset 0 0 20px rgba(0, 217, 255, 0.05)',
            },
            transitionTimingFunction: {
                'apple-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            animation: {
                'crystal-rotate': 'crystal-rotate 8s linear infinite',
                'crystal-pulse': 'crystal-pulse 2s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                'crystal-rotate': {
                    '0%': { transform: 'rotateZ(0deg)' },
                    '100%': { transform: 'rotateZ(360deg)' },
                },
                'crystal-pulse': {
                    '0%, 100%': {
                        opacity: '1',
                        boxShadow: '0 0 0 0 rgba(0, 217, 255, 0.4)'
                    },
                    '50%': {
                        boxShadow: '0 0 0 10px rgba(0, 217, 255, 0)'
                    },
                }
            }
        },
    },
    plugins: [],
}
