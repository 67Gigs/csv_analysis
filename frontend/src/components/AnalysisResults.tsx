// AnalysisResults.tsx
import React from 'react';
import { styles } from '../styles.ts';
import { FileAnalysisResult } from '../types/types.ts';

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

interface AnalysisResultsProps {
  results: FileAnalysisResult[];
  showAll?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, showAll = false }) => {
  const displayResults = showAll ? results : results.slice(0, 3);

  return (
    <div>
      {!showAll && <h2 style={styles.sectionTitle}>Résultats d'analyse récents</h2>}
      {displayResults.map((result) => (
        <div key={result.id} style={styles.resultCard}>
        <h3 style={styles.resultTitle}>
          <FileIcon />
          {result.filename}
        </h3>
          <p style={styles.resultTimestamp}>
            Analysé le : {new Date(result.timestamp).toLocaleString('fr-FR')}
          </p>
          
          <h4 style={styles.statTitle}>Statistiques globales</h4>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h5 style={styles.statTitle}>Statistiques des prix</h5>
              <p style={styles.statValue}>Moyenne : {result.statistics.prix.mean.toFixed(2)}€</p>
              <p style={styles.statValue}>Médiane : {result.statistics.prix.median.toFixed(2)}€</p>
              <p style={styles.statValue}>Écart-type : {result.statistics.prix.stdDev.toFixed(2)}€</p>
            </div>
            <div style={styles.statCard}>
              <h5 style={styles.statTitle}>Statistiques des quantités</h5>
              <p style={styles.statValue}>Moyenne : {result.statistics.quantite.mean.toFixed(0)} unités</p>
              <p style={styles.statValue}>Médiane : {result.statistics.quantite.median.toFixed(0)} unités</p>
              <p style={styles.statValue}>Écart-type : {result.statistics.quantite.stdDev.toFixed(1)} unités</p>
            </div>
            <div style={styles.statCard}>
              <h5 style={styles.statTitle}>Statistiques des notes client</h5>
              <p style={styles.statValue}>Moyenne : {result.statistics.note_client.mean.toFixed(1)}/5</p>
              <p style={styles.statValue}>Médiane : {result.statistics.note_client.median.toFixed(1)}/5</p>
              <p style={styles.statValue}>Écart-type : {result.statistics.note_client.stdDev.toFixed(2)}</p>
            </div>
          </div>

          <h4 style={styles.statTitle}>Détection d'anomalies</h4>
          {result.anomalies.length > 0 ? (
            <>
              <div>
                <p style={styles.statValue}>
                  {result.anomalies.length} anomalie{result.anomalies.length > 1 ? 's' : ''} détectée{result.anomalies.length > 1 ? 's' : ''} 
                  dont {result.anomalies.filter(anomaly => anomaly.type === 'prix').length} sur les prix, 
                  {result.anomalies.filter(anomaly => anomaly.type === 'quantite').length} sur les quantités 
                  et {result.anomalies.filter(anomaly => anomaly.type === 'note_client').length} sur les notes client,
                  le nombre de ligne qui contiennent des anomalies est de {result.anomalies.map(anomaly => anomaly.rowId).filter((value, index, self) => self.indexOf(value) === index).length}
                </p>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Valeur trouvée</th>
                    <th style={styles.th}>Plage attendue</th>
                    <th style={styles.th}>Ligne</th>
                  </tr>
                </thead>
                <tbody>
                  {result.anomalies.map((anomaly, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{
                        anomaly.type === 'prix' ? 'Prix' :
                        anomaly.type === 'quantite' ? 'Quantité' :
                        'Note client'
                      }</td>
                      <td style={styles.td}>
                        {anomaly.type === 'prix' ? `${anomaly.value}€` :
                        anomaly.type === 'quantite' ? `${anomaly.value} unités` :
                        `${anomaly.value}/5`}
                      </td>
                      <td style={styles.td}>{anomaly.expected}</td>
                      <td style={styles.td}>{anomaly.rowId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p style={styles.statValue}>Aucune anomalie détectée dans les données</p>
          )}
        </div>
      ))}
    </div>
  );
};