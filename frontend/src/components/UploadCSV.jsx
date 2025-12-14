import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const UploadCSV = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File troppo grande. Max 5MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').slice(0, 6);
        const parsed = lines.map(line => line.split(','));
        setPreviewData(parsed);
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Carica un file CSV valido');
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

  const handleUpload = async () => {
    setIsUploading(true);
    // Simula upload con progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    setIsUploading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">📊 Carica i tuoi Dati</h1>
          <p className="text-lg text-gray-600">Esporta il CSV dalla tua cassa e scopri i pattern nascosti</p>
        </div>

        {/* Main Upload Card */}
        <GlassCard className="mb-8">
          {!file ? (
            // Upload Area
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative px-8 py-16 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-blue-200 bg-blue-50/30 hover:border-blue-400'
              }`}
            >
              {/* Animated Upload Icon */}
              <div className={`flex justify-center mb-6 transition-transform ${
                isDragging ? 'scale-110' : ''
              }`}>
                <div className="relative">
                  <Upload className="w-16 h-16 text-blue-500 animate-bounce" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"></div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragging ? '✨ Rilascia qui!' : 'Trascina il tuo CSV'}
                </h3>
                <p className="text-gray-600 mb-4">oppure clicca per sfogliare</p>
                <p className="text-sm text-gray-500">CSV • Max 5MB • Formato: data, coperti, importo</p>
              </div>

              {/* Hidden Input */}
              <input
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            // File Selected State
            <div>
              {/* File Info */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setError(null);
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* Preview Table */}
              {previewData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Anteprima Dati</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-blue-200 bg-blue-50/50">
                          {previewData[0].map((header, i) => (
                            <th key={i} className="px-4 py-3 text-left font-semibold text-gray-700">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(1).map((row, i) => (
                          <tr key={i} className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                            {row.map((cell, j) => (
                              <td key={j} className="px-4 py-3 text-gray-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Upload in corso...</span>
                    <span className="text-sm font-semibold text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {file && !isUploading && (
          <div className="flex gap-4">
            <button
              onClick={() => setFile(null)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Analizza Dati ✓
            </button>
          </div>
        )}

        {/* Info Steps */}
        {!file && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '1', title: 'Esporta', desc: 'Esporta il CSV dalla tua cassa' },
              { num: '2', title: 'Carica', desc: 'Trascina o seleziona il file' },
              { num: '3', title: 'Analizza', desc: 'Scopri i pattern e le previsioni' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold mb-3">
                  {step.num}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCSV;
