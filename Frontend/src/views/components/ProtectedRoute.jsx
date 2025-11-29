import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const ProtectedRoute = ({ children }) => {
    const { connected, account } = useWallet();

    if (!connected || !account) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
