import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCallback } from 'react';

export const useWalletConnection = () => {
  const { connect, disconnect, account, connected, wallets, signAndSubmitTransaction } = useWallet();

  const handleConnect = useCallback(async () => {
    try {
      const installedWallets = wallets?.filter(wallet =>
        wallet.readyState === 'Installed' || wallet.readyState === 'Loadable'
      ) || [];

      if (installedWallets.length > 0) {
        await connect(installedWallets[0].name);
      } else {
        alert('Please install Petra or Martian wallet extension in your browser.\n\nPetra: https://petra.app/\nMartian: https://martianwallet.xyz/');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      alert('Failed to connect wallet: ' + err.message);
    }
  }, [connect, wallets]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Wallet disconnection error:', err);
    }
  }, [disconnect]);

  return {
    connect: handleConnect,
    disconnect: handleDisconnect,
    account,
    isConnected: connected,
    signAndSubmitTransaction
  };
};
