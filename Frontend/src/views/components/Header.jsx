import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const Header = () => {
    const { connect, disconnect, account, connected, wallets } = useWallet();

    const navigate = useNavigate();

    const handleConnect = async () => {
        try {
            // Connect to Petra (first wallet)
            await connect(wallets[0].name);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleLogin = async () => {
        if (!account) return;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress: account.address.toString() })
            });
            const data = await response.json();
            console.log('Logged in:', data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    useEffect(() => {
        if (connected && account) {
            handleLogin();
        } else if (!connected) {
            navigate('/');
        }
    }, [connected, account, navigate]);

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="text-xl font-bold text-blue-600">Campus Wallet</div>
            <div>
                {connected && account ? (
                    <div className="flex items-center gap-4">
                        <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-mono text-gray-700">
                            {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
                        </span>
                        <button
                            onClick={disconnect}
                            className="text-sm text-red-500 hover:underline font-semibold"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleConnect}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-bold shadow-md shadow-blue-200"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
