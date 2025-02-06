// types.ts
export interface FileAnalysisResult {
    id: string;
    filename: string;
    timestamp: string;
    statistics: {
      prix: {
        mean: number;
        median: number;
        stdDev: number;
      };
      quantite: {
        mean: number;
        median: number;
        stdDev: number;
      };
      note_client: {
        mean: number;
        median: number;
        stdDev: number;
      };
    };
    anomalies: {
      type: 'prix' | 'quantité' | 'note_client';
      value: number;
      expected: string;
      rowId: number;
    }[];
  }