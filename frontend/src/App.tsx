import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { FileAnalysisResult } from './types/types';
import { styles } from './styles.ts';
import { uploadCSV, getAnalysisResults } from './api.ts';

const App: React.FC = () => {
  const [results, setResults] = useState<FileAnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      const analysisResults = [await getAnalysisResults()];
      const formattedResults: FileAnalysisResult[] = analysisResults.map(result => ({
        id: result._id,
        filename: result.filename,
        timestamp: result.timestamp,
        statistics: {
          prix: {
            mean: result.stats.avgPrice,
            median: result.stats.medianPrice,
            stdDev: result.stats.stdPrice
          },
          quantite: {
            mean: result.stats.avgQuantity,
            median: result.stats.medianQuantity,
            stdDev: result.stats.stdQuantity
          },
          note_client: {
            mean: result.stats.avgRating,
            median: result.stats.medianRating,
            stdDev: result.stats.stdRating
          }
        },
        anomalies: result.stats.anomalies.map(anomaly => ({
          type: anomaly.Column.toLowerCase() as "prix" | "quantité" | "note_client",
          value: anomaly.Value,
          expected: 'Valeur hors limites',
          rowId: anomaly.ID
        }))
      }));
      setResults(formattedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des résultats');
    }
  };


  const handleFileUpload = async (file: File, email?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await uploadCSV(file, email);
      await fetchResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  return (
    <BrowserRouter>
      <Navigation />
      <div style={containerStyles}>
        {error && <div style={styles.loadingMessage}>{error}</div>}
        {isLoading && <div style={styles.loadingMessage}>Traitement en cours...</div>}
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                results={results} 
                onFileUpload={handleFileUpload} 
                isLoading={isLoading}
              />
            } 
          />
          <Route path="/history" element={<History results={results} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;