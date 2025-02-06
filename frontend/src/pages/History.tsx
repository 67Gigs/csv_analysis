import React from 'react';
import { AnalysisResults } from '../components/AnalysisResults.tsx';
import { FileAnalysisResult } from '../types/types.ts';

interface HistoryProps {
  results: FileAnalysisResult[];
}

export const History: React.FC<HistoryProps> = ({ results }) => {
  return (
    <div>
      <h1>Analysis History</h1>
      <AnalysisResults results={results} showAll />
    </div>
  );
};