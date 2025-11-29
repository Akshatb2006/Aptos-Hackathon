import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { User, Mail, Lock, ArrowRight, Wallet, Loader, Shield } from 'lucide-react';

const Signup = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { connect, connected, account, wallets } = useWallet();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input
    };

    const handleSignup = async () => {
        // 1. Validation
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Please fill in all required fields (Name and Email).');
            return;
        }

        setIsSubmitting(true);

        // 2. Connect Wallet if not connected
        if (!connected) {
            try {
                // Assuming Petra is the first wallet, or use a specific one
                const petraWallet = wallets.find(w => w.name === 'Petra') || wallets[0];
                if (petraWallet) {
                    await connect(petraWallet.name);
                } else {
                    setError('No compatible wallet found. Please install Petra Wallet.');
                    setIsSubmitting(false);
                }
            } catch (err) {
                console.error('Failed to connect wallet:', err);
                setError('Failed to connect wallet. Please try again.');
                setIsSubmitting(false);
            }
        }
        // If already connected, the useEffect will trigger the API call
    };

    // 3. Trigger Registration when Connected + Submitting
    useEffect(() => {
        const registerUser = async () => {
            if (connected && account && isSubmitting) {
                try {
                    const response = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            walletAddress: account.address.toString(),
                            name: formData.name,
                            email: formData.email,
                            role: role
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('userRole', data.role);
                        navigate('/dashboard');
                    } else {
                        const errData = await response.json();
                        setError(errData.error || 'Registration failed. Please try again.');
                        setIsSubmitting(false);
                    }
                } catch (err) {
                    console.error('Registration API error:', err);
                    setError('Network error. Please check your connection.');
                    setIsSubmitting(false);
                }
            }
        };

        registerUser();
    }, [connected, account, isSubmitting, formData, role, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-blue-100">Join Campus Wallet today</p>
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

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@university.edu"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password (Optional)</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSignup}
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl text-white font-bold transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-5 h-5" /> Connect & Create Account
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
