import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styles } from '../styles.ts';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <ul style={styles.navList}>
          <li>
            <Link 
              to="/" 
              style={{
                ...styles.navLink,
                ...(location.pathname === '/' ? styles.navLinkActive : {})
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/history" 
              style={{
                ...styles.navLink,
                ...(location.pathname === '/history' ? styles.navLinkActive : {})
              }}
            >
              Analysis History
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
