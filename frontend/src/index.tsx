import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.ts';
import App from './App.tsx';  // ou './App' si ça ne fonctionne pas

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);