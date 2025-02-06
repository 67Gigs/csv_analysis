// src/styles.ts
export const styles = {
  container: {
    maxWidth: '1200px',
    margin: 'auto auto',
    padding: '0 0px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  nav: {
    backgroundColor: '#ffffff',
    padding: '10px 0', 
    marginBottom: '20px',
    borderBottom: '1px solid #eaeaea',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    left: 0,
    right: 0
  },
  navInner: {
    maxWidth: '4200px',
    padding: '0 20px'
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    textDecoration: 'none',
    color: '#666',
    fontWeight: 500,
    fontSize: '16px',
    padding: '8px 0',
    position: 'relative' as const,
    transition: 'color 0.2s'
  },
  navLinkActive: {
    color: '#0066cc'
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '30px',
    color: '#111'
  },
  // Nouveaux styles pour l'email
  emailContainer: {
    marginBottom: '15px',
    width: '50%',
    display: 'flex',
  },
  emailInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'white',
    '&:focus': {
      borderColor: '#0066cc',
      boxShadow: '0 0 0 2px rgba(0,102,204,0.1)'
    }
  },
  emailError: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '8px',
    padding: '0 4px'
  },
  // Styles pour l'upload
  uploadContainer: {
    border: '2px dashed #e0e0e0',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'all 0.2s ease',
    marginBottom: '40px'
  },
  uploadContainerDragging: {
    backgroundColor: '#f0f7ff',
    borderColor: '#0066cc'
  },
  uploadText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px'
  },
  uploadButton: {
    padding: '12px 24px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#0052a3'
    }
  },
  // Styles pour les résultats
  resultCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  resultTitle: {
    fontSize: '1.25rem',
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500
  },
  resultIcon: {
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  resultTimestamp: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    paddingTop: '2px',
    borderRadius: '8px',
    display: 'flex',           
    flexDirection: 'column' as 'column',   
    alignItems: 'center' as 'center',      
    textAlign: 'center'as 'center'
  },
  statTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '12px',
    color: '#111',
    textTransform: 'capitalize' as const
  },
  statValue: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '16px'
  },
  th: {
    textAlign: 'left' as const,
    padding: '12px',
    borderBottom: '2px solid #eaeaea',
    color: '#666',
    fontWeight: 600
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eaeaea',
    color: '#444'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '24px',
    color: '#111'
  }
};