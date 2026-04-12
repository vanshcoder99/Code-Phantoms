import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithRouting from './AppWithRouting';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithRouting />
  </React.StrictMode>
);

reportWebVitals();
