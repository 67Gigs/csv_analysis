import React, { useState, useEffect } from 'react';
import { getAllAnalysisResults } from '../api.ts';

const FileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginRight: '8px' }}
  >
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17H8"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 9H9H8"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const results = await getAllAnalysisResults();
        const formattedResults = results.map(result => ({
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
          anomalies: result.stats.anomalies
        }));
        setAnalyses(formattedResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-lg shadow-sm">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          Erreur: {error}
        </div>
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-50 text-gray-700 px-6 py-4 rounded-lg shadow-sm">
          Aucune analyse n'a été effectuée
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-8 text-left text-sm font-semibold text-gray-900">Fichier</th>
                <th className="px-6 py-8 text-left text-sm font-semibold text-gray-900">Date d'analyse</th>
                <th className="px-6 py-8 text-left text-sm font-semibold text-gray-900">Anomalies</th>
                <th className="px-6 py-8 text-left text-sm font-semibold text-gray-900">Prix moyen</th>
                <th className="px-6 py-8 text-left text-sm font-semibold text-gray-900">Quantité moyenne</th>
                <th className="px-6 py-8 text-left text-sm font-semibold text-gray-900">Note moyenne</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis, index) => (
                <tr 
                  key={analysis.id} 
                  className={`
                    hover:bg-blue-50 transition-colors border-b border-gray-200
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  `}
                >
                  <td className="px-6 py-8">
                    <div className="flex items-center">
                      <FileIcon />
                      <span className="text-sm font-medium text-gray-900">{analysis.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-sm text-gray-600">
                    {new Date(analysis.timestamp).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-8">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.anomalies.length > 0 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {analysis.anomalies.length} anomalie(s)
                    </span>
                  </td>
                  <td className="px-6 py-8 text-sm font-medium text-gray-900">
                    {analysis.statistics.prix.mean.toFixed(2)}€
                  </td>
                  <td className="px-6 py-8 text-sm font-medium text-gray-900">
                    {Math.round(analysis.statistics.quantite.mean)} unités
                  </td>
                  <td className="px-6 py-8 text-sm font-medium text-gray-900">
                    {analysis.statistics.note_client.mean.toFixed(1)}/5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;