import React from 'react';
import { Header } from '../components/Header';
import UploadCSV from '../components/UploadCSV';

const UploadPage = () => {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <Header />
            <main className="container mx-auto max-w-7xl p-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-light mb-4">Carica i tuoi dati storici</h1>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Carica il file CSV esportato dal tuo software di cassa.
                        Crystal Ball analizzerà i pattern per generare previsioni accurate sui coperti.
                    </p>
                </div>

                <UploadCSV />
            </main>
        </div>
    );
};

export default UploadPage;
