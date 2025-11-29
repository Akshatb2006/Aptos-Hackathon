import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import App from './App'
import './index.css'

const wallets = [new PetraWallet()];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AptosWalletAdapterProvider>
  </React.StrictMode>,
)
