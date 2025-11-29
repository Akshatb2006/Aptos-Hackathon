import React, { useState, useEffect, useRef } from 'react';
import { Users, Award, Gift, TrendingUp, BarChart3, Upload, Plus, Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { MODULE_ADDRESS } from '../../aptosConfig';

// Vanta WAVES Background Component  
const VantaWavesBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;

    const initVanta = async () => {
      try {
        const THREE = await import('three');
        if (!window.THREE) window.THREE = THREE;
        
        const { default: WAVES } = await import('vanta/dist/vanta.waves.min');
        
        effect = WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          shininess: 90.00,
          waveHeight: 18.00,
          waveSpeed: 1.10,
          zoom: 0.90,
          color: 0x0a0a0a,
          backgroundColor: 0x05020b
        });
        
        setVantaEffect(effect);
      } catch (error) {
        console.error('Failed to load Vanta WAVES:', error);
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

  return <div ref={vantaRef} className="absolute inset-0 z-0" />;
};

export default function AdminApp({ view, setView, token }) {
  const { signAndSubmitTransaction, account, connect, disconnect, wallets } = useWallet();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    category: 'food',
    stock: -1,
    imageUrl: ''
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPoints, setUploadPoints] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [awardAmount, setAwardAmount] = useState('');

  useEffect(() => {
    loadAnalytics();
    loadRewards();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.admin.getUsers(token);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleAwardPoints = async (user, amount) => {
    if (!amount || amount <= 0) return alert('Invalid amount');

    try {
      const res = await api.admin.awardPoints(token, {
        userId: user._id,
        points: parseInt(amount),
        description: 'Awarded by Admin'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to award points');
      }

      if (user.walletAddress) {
        // Check if connected wallet is the admin (module owner)
        // Check if connected wallet is the admin (module owner)
        if (!account || String(account.address) !== MODULE_ADDRESS) {
          alert(`⚠️ WRONG WALLET CONNECTED\n\nRequired: Admin Wallet (${MODULE_ADDRESS.slice(0, 6)}...)\nConnected: ${account ? String(account.address).slice(0, 6) + '...' : 'None'}\n\nHOW TO FIX:\n1. Open your Petra/Martian extension.\n2. Switch to the account starting with 0x9fa...\n3. If you don't have it, import the Private Key provided earlier.`);
          setSelectedUser(null);
          setAwardAmount('');
          loadUsers();
          loadAnalytics();
          return;
        }

        try {
          const payload = {
            data: {
              function: `${MODULE_ADDRESS}::campus_coin::mint`,
              typeArguments: [],
              functionArguments: [user.walletAddress, amount]
            }
          };

          await signAndSubmitTransaction(payload);
          alert('Points awarded on-chain and in database!');
        } catch (txError) {
          console.error('Blockchain transaction failed:', txError);
          alert('Points awarded in database, but blockchain transaction failed.');
        }
      } else {
        alert('Points awarded successfully! (Student has not connected wallet yet)');
      }

      setSelectedUser(null);
      loadUsers();
      loadAnalytics();
    } catch (err) {
      console.error(err);
      alert('Error awarding points: ' + err.message);
    }
  };

  const loadAnalytics = async () => {
    const res = await api.admin.getAnalytics(token);
    const data = await res.json();
    setAnalytics(data);
  };

  const loadRewards = async () => {
    const res = await api.admin.getRewards(token);
    const data = await res.json();
    setRewards(data);
  };

  const handleCreateReward = async () => {
    try {
      const res = await api.admin.createReward(token, formData);
      if (!res.ok) throw new Error('Failed to create reward');
      alert('Reward created!');
      loadRewards();
      setFormData({ name: '', description: '', pointsCost: 0, category: 'food', stock: -1, imageUrl: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUploadCSV = async () => {
    if (!uploadFile) return alert('Select a file');

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', uploadFile);
    formDataUpload.append('pointsPerAttendance', uploadPoints);

    try {
      const res = await api.admin.uploadAttendance(token, formDataUpload);
      const data = await res.json();
      alert(`Processed: ${data.processed}, Errors: ${data.errors}`);
      setUploadFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleConnectWallet = async () => {
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
  };

  const filteredUsers = users.filter(user =>
    user.role === 'student' &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Admin Dashboard View
  if (view === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
          >
            Admin Dashboard
          </motion.h2>

          {/* Wallet Connection */}
          <div className="mb-8 flex justify-end">
            {!account ? (
              <motion.button
                onClick={handleConnectWallet}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Connect Admin Wallet
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${account.address === MODULE_ADDRESS ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                  <div>
                    <p className="text-xs text-purple-200">
                      {account.address === MODULE_ADDRESS ? 'Connected as Admin' : 'Wrong Wallet Connected'}
                    </p>
                    <p className="font-mono text-sm text-white">
                      {account?.address ? `${String(account.address).slice(0, 6)}...${String(account.address).slice(-4)}` : '...'}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={disconnect}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500/20 text-red-400 px-4 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all border border-red-500/30"
                >
                  Disconnect
                </motion.button>
              </div>
            )}
          </div>

          {analytics && (
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Total Students', value: analytics.totalUsers, gradient: 'from-purple-600 to-blue-600', bg: 'from-purple-500/20 to-blue-500/20' },
                { icon: Award, label: 'Points Issued', value: analytics.totalPointsIssued, gradient: 'from-emerald-600 to-teal-600', bg: 'from-emerald-500/20 to-teal-500/20' },
                { icon: Gift, label: 'Redemptions', value: analytics.totalRedemptions, gradient: 'from-pink-600 to-purple-600', bg: 'from-pink-500/20 to-purple-500/20' },
                { icon: TrendingUp, label: 'Active Rewards', value: analytics.activeRewards, gradient: 'from-orange-600 to-red-600', bg: 'from-orange-500/20 to-red-500/20' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 shadow-xl overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative z-10">
                      <Icon className={`w-12 h-12 mb-4 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                      <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Manage Students View
  if (view === 'manage-students') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
          >
            Manage Students
          </motion.h2>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="relative overflow-x-hidden">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/40 backdrop-blur-2xl border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>

          {/* Students Table */}
          <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/30 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.rollNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.walletAddress ? (
                          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs bg-gray-700/50 text-gray-400">Not Connected</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedUser(user)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-sm"
                        >
                          Award Points
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Award Points Modal */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedUser(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-gray-800 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Award Points</h3>
                      <p className="text-gray-400 mt-1">{selectedUser.name}</p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                    <input
                      type="text"
                      value={awardAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setAwardAmount(val);
                      }}
                      placeholder="Enter points to award"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setAwardAmount('');
                      }}
                      className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const amount = parseInt(awardAmount);
                        if (amount) handleAwardPoints(selectedUser, amount);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      Award
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Manage Rewards View
  if (view === 'manage-rewards') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Manage Rewards
          </motion.h2>

          {/* Create New Reward */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Create New Reward</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Reward Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="Points Cost"
                value={formData.pointsCost}
                onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) || 0 })}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="Stock (-1 for unlimited)"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || -1 })}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="food">Food</option>
                <option value="subscription">Subscription</option>
                <option value="event">Event</option>
                <option value="coupon">Coupon</option>
                <option value="merchandise">Merchandise</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all md:col-span-2"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateReward}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 md:col-span-2"
              >
                <Plus className="w-5 h-5" />
                Create Reward
              </motion.button>
            </div>
          </motion.div>

          {/* Existing Rewards */}
          <div className="grid md:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-gray-800 shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-white">{reward.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    reward.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {reward.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {reward.pointsCost} pts
                  </span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 capitalize block">{reward.category}</span>
                    <span className="text-xs text-gray-600">
                      {reward.stock === -1 ? 'Unlimited' : `${reward.stock} left`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Upload Attendance View
  if (view === 'upload-attendance') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
          >
            Upload Attendance
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">CSV File</label>
                <div className="relative overflow-x-hidden">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 transition-all cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">CSV must contain email or rollNumber column</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Points Per Attendance</label>
                <input
                  type="number"
                  value={uploadPoints}
                  onChange={(e) => setUploadPoints(parseInt(e.target.value) || 10)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {uploadFile && (
                <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">{uploadFile.name}</span>
                  </div>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUploadCSV}
                disabled={uploading || !uploadFile}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {uploading ? 'Processing...' : 'Upload & Process'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
