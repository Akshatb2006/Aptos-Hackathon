import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { User, Shield, ArrowRight, Wallet } from 'lucide-react';

const Auth = () => {
    const [role, setRole] = useState('student'); // 'student' | 'admin'
    const navigate = useNavigate();
    const { connect, connected, account, wallets } = useWallet();

    const handleLogin = async () => {
        try {
            // Connect to Petra (first wallet)
            await connect(wallets[0].name);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    useEffect(() => {
        const authenticateUser = async () => {
            if (connected && account) {
                try {
                    // Call Backend to verify/login
                    const response = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            walletAddress: account.address.toString(),
                            role: role // Send selected role to update/verify
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('userRole', data.role); // Use role from DB
                        navigate('/dashboard');
                    } else {
                        console.error('Backend login failed');
                    }
                } catch (error) {
                    console.error('Login API error:', error);
                }
            }
        };

        authenticateUser();
    }, [connected, account, navigate, role]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-blue-100">Connect Wallet to Login</p>
                </div>

                {/* Role Selection */}
                <div className="p-8">
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <User className="w-4 h-4" /> Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Shield className="w-4 h-4" /> Admin
                        </button>
                    </div>

                    {/* Action */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                            Please connect your Aptos wallet to continue as a <strong>{role}</strong>.
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            <Wallet className="w-5 h-5" /> Connect Wallet & Login
                        </button>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Powered by Aptos
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
