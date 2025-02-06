import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation.tsx';
import { Home } from './pages/Home.tsx';
import { History } from './pages/History.tsx';
import { FileAnalysisResult } from './types/types.ts';
import { styles } from './styles.ts';

const App: React.FC = () => {
  const [results, setResults] = useState<FileAnalysisResult[]>([]);

  const handleFileUpload = async (file: File, email?: string) => {
    const mockResult: FileAnalysisResult = {
      id: Date.now().toString(),
      filename: file.name,
      timestamp: new Date().toISOString(),
      statistics: {
        prix: { mean: 250, median: 245, stdDev: 50 },
        quantite: { mean: 25, median: 23, stdDev: 10 },
        note_client: { mean: 4.2, median: 4.0, stdDev: 0.8 }
      },
      anomalies: []
    };

    setResults(prev => [mockResult, ...prev]);
};

  return (
    <BrowserRouter>
      <div style={styles.container}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home results={results} onFileUpload={handleFileUpload} />} />
          <Route path="/history" element={<History results={results} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;