import React from 'react';
import { Header } from '../components/Header';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Check, X } from 'lucide-react';

const PricingTier = ({
    title,
    price,
    description,
    features,
    isPopular = false,
    ctaText = "Choose Plan",
    ctaVariant = "secondary"
}) => {
    return (
        <GlassCard className={`flex flex-col p-8 relative ${isPopular ? 'border-accent-cyan shadow-[0_0_40px_rgba(0,217,255,0.15)] transform scale-105 z-10' : 'border-border-subtle'}`}>
            {isPopular && (
                <div className="absolute top-4 right-4 bg-accent-cyan text-bg-primary text-xs font-bold px-2 py-1 rounded">
                    MOST POPULAR
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-xl font-light text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm h-10">{description}</p>
            </div>
            <div className="mb-8">
                <span className="text-4xl font-light text-text-primary">{price}</span>
                {price !== 'Custom' && <span className="text-text-secondary">/month</span>}
            </div>

            <div className="flex-grow space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                            <Check size={18} className="text-accent-cyan shrink-0 mt-0.5" />
                        ) : (
                            <X size={18} className="text-text-secondary shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>

            <Button variant={ctaVariant} className="w-full justify-center">
                {ctaText}
            </Button>
        </GlassCard>
    );
};

const PricingPage = () => {
    const tiers = [
        {
            title: "Free",
            price: "€0",
            description: "Best for starting out and testing the waters.",
            ctaText: "Sign up",
            ctaVariant: "secondary",
            features: [
                { text: "1 upload / month", included: true },
                { text: "7-day forecast", included: true },
                { text: "Smart Insights", included: false },
                { text: "Email digest", included: false },
                { text: "Export data", included: false },
            ]
        },
        {
            title: "Pro",
            price: "€19",
            description: "Most popular for growing restaurants.",
            isPopular: true,
            ctaText: "Start",
            ctaVariant: "primary",
            features: [
                { text: "Unlimited uploads", included: true },
                { text: "Confidence insights", included: true },
                { text: "Email digest", included: true },
                { text: "Export data", included: true },
                { text: "Priority support", included: false },
            ]
        },
        {
            title: "Enterprise",
            price: "Custom",
            description: "Full power for restaurant chains.",
            ctaText: "Contact",
            ctaVariant: "secondary",
            features: [
                { text: "All Pro features", included: true },
                { text: "Multi-location", included: true },
                { text: "Priority support", included: true },
                { text: "API Access", included: true },
                { text: "Custom integration", included: true },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <Header />
            <main className="container mx-auto max-w-7xl p-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-light mb-4">Scegli il tuo piano</h1>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Inizia gratuitamente e passa al piano Pro quando sei pronto per scalare.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {tiers.map((tier, idx) => (
                        <PricingTier key={idx} {...tier} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PricingPage;
