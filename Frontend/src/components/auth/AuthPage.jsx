import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, Lock, Mail, User, Hash, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -100, 100],
            x: [null, 50, -50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Star Field Component
const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rollNumber: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  // Initialize Vanta.js background
  useEffect(() => {
    let effect = null;

    const initVanta = async () => {
      try {
        // Import THREE and make it globally available
        const THREE = await import('three');
        if (!window.THREE) window.THREE = THREE;
        
        // Dynamically import Vanta NET
        const { default: NET } = await import('vanta/dist/vanta.net.min');
        
        effect = NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x141da2,
          backgroundColor: 0x05020b,
          points: 12,
          maxDistance: 18,
          spacing: 16,
          showDots: true
        });
        
        setVantaEffect(effect);
        setVantaLoaded(true);
      } catch (error) {
        console.error('Failed to load Vanta.js:', error);
        setVantaLoaded(true);
      }
    };

    if (typeof window !== 'undefined') {
      initVanta();
    }

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Regex Patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const rollNumberRegex = /^[a-zA-Z0-9]+$/;

    // Validation
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!nameRegex.test(formData.name)) {
        setError('Name must contain only alphabets and spaces');
        setLoading(false);
        return;
      }
      if (!rollNumberRegex.test(formData.rollNumber)) {
        setError('Roll Number must be alphanumeric');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? api.auth.login : api.auth.register;
      const res = await endpoint(formData);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Vanta.js Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0">
        {!vantaLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-gray-900/80 to-black" />
          </div>
        )}
      </div>

      {/* Particle Effects */}
      <ParticleBackground />
      <StarField />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Glass Morphism Container */}
          <div className="relative bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600"></div>
            
            {/* Sparkle Effect */}
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>

            {/* Logo and Title */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Wallet className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                CampusWallet
              </h2>
              <p className="text-gray-400 text-sm">
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Roll Number Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Roll Number"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Role Select */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white backdrop-blur-sm transition-all appearance-none cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: isLogin ? 0.1 : 0.4 }}
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm transition-all"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: isLogin ? 0.2 : 0.5 }}
              >
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm transition-all"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Electric pulse effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative z-10">
                  {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                </span>
                {!loading && <ArrowRight className="w-5 h-5 relative z-10" />}
              </motion.button>
            </form>

            {/* Toggle Login/Register */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-gray-400 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    navigate(isLogin ? '/signup' : '/login');
                    setError('');
                  }}
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                >
                  {isLogin ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
              >
                ← Back to home
              </button>
            </motion.div>
          </div>

          {/* Bottom Decoration */}
          <motion.div
            className="mt-8 text-center text-gray-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Secured by blockchain technology</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
