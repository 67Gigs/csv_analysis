const API_BASE_URL = 'https://csvanalysis-production.up.railway.app/api';

interface AnalysisResponse {
  _id: string;
  filename: string;
  timestamp: string;
  stats: {
    avgPrice: number;
    avgQuantity: number;
    avgRating: number;
    medianPrice: number;
    medianQuantity: number;
    medianRating: number;
    stdPrice: number;
    stdQuantity: number;
    stdRating: number;
    anomalies: Array<{
      ID: number;
      Column: string;
      Value: number;
    }>;
  };
}

export const uploadCSV = async (file: File, email?: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email || '');

  const response = await fetch(`${API_BASE_URL}/upload-csv`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Une erreur est survenue');
  }

  return response.json();
};

export const getAnalysisResults = async (): Promise<AnalysisResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  const response = await fetch(`${API_BASE_URL}/latest-analysis`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Une erreur est survenue');
  }

  return await response.json();
};