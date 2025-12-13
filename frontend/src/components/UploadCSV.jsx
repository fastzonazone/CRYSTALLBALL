import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const UploadCSV = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const processFile = (selectedFile) => {
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError(null);

            // Simulating CSV parsing for preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n').slice(0, 6); // Header + 5 rows
                const parsed = lines.map(line => line.split(','));
                setPreviewData(parsed);
            };
            reader.readAsText(selectedFile);
        } else {
            setError('Please upload a valid CSV file.');
            setFile(null);
            setPreviewData([]);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // Implement actual upload logic here
        // For now, redirect to dashboard simulated
        navigate('/dashboard');
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <label
                className={`
                    flex flex-col items-center justify-center w-full h-64 
                    border-2 border-dashed rounded-2xl cursor-pointer 
                    transition-all duration-300 ease-apple-ease
                    ${isDragging
                        ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_20px_rgba(0,217,255,0.2)]'
                        : 'border-border-subtle bg-white/5 hover:border-accent-cyan/50 hover:bg-accent-cyan/5'
                    }
                    ${error ? 'border-accent-pink bg-accent-pink/5' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {file ? (
                        <div className="w-16 h-16 rounded-full bg-accent-mint/20 text-accent-mint flex items-center justify-center mb-4">
                            <FileText size={32} />
                        </div>
                    ) : (
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-accent-cyan text-bg-primary' : 'bg-white/10 text-text-secondary'}`}>
                            <Upload size={32} />
                        </div>
                    )}

                    {file ? (
                        <>
                            <p className="mb-2 text-lg text-text-primary font-medium">{file.name}</p>
                            <p className="text-sm text-text-secondary">{(file.size / 1024).toFixed(2)} KB</p>
                            <Button variant="ghost" onClick={(e) => { e.preventDefault(); setFile(null); setPreviewData([]); }} className="mt-4 text-accent-pink hover:bg-accent-pink/10 hover:text-accent-pink">
                                Remove file
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="mb-2 text-lg text-text-primary font-light">
                                <span className="font-medium text-accent-cyan">Clicca per caricare</span> o trascina il file qui
                            </p>
                            <p className="text-xs text-text-secondary">CSV (MAX. 5MB)</p>
                        </>
                    )}

                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-accent-pink">
                            <AlertCircle size={16} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>
                <input type="file" className="hidden" accept=".csv" onChange={handleChange} />
            </label>

            {/* Preview Section */}
            {previewData.length > 0 && (
                <GlassCard className="mt-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-light text-text-primary">Anteprima Dati</h3>
                        <span className="text-xs text-text-secondary mono">Showing first 5 rows</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs text-text-primary uppercase bg-white/5">
                                <tr>
                                    {previewData[0].map((header, i) => (
                                        <th key={i} className="px-4 py-3 font-medium tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(1).map((row, i) => (
                                    <tr key={i} className="border-b border-border-ultra hover:bg-white/5 transition-colors">
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-4 py-3">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button variant="primary" onClick={handleUpload} className="px-8 shadow-glow">
                            Analizza Dati
                        </Button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

export default UploadCSV;
