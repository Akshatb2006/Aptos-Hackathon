import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AptosProvider from './components/AptosProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AptosProvider>
      <App />
    </AptosProvider>
  </React.StrictMode>
);