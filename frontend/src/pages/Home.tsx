import React from 'react';
import { FileUpload } from '../components/FileUpload.tsx';
import { AnalysisResults } from '../components/AnalysisResults.tsx';
import { FileAnalysisResult } from '../types/types.ts';

interface HomeProps {
  results: FileAnalysisResult[];
  onFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export const Home: React.FC<HomeProps> = ({ results, onFileUpload, isLoading }) => {
  return (
    <div>
      <h1>CSV File Analyzer</h1>
      <FileUpload onFileUpload={onFileUpload} />
      <AnalysisResults results={results} />
    </div>
  );
};
