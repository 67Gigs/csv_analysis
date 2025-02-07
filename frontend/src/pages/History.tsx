import React from 'react';
import AnalysisHistory from '../components/AnalysisHistory.tsx';

const History = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Historique des Analyses
      </h1>
      <AnalysisHistory />
    </div>
  );
};

export default History;