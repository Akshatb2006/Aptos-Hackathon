import React, { useState, useEffect, useRef } from 'react';
import { Award, TrendingUp, Gift, Wallet, Check, Clock, Download, Sparkles, ArrowRight, X, Search } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { AptosClient } from 'aptos';
import { MODULE_ADDRESS } from '../../aptosConfig';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

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

export default function StudentApp({ view, setView, token, user }) {
  const { connect, account, connected, wallets } = useWallet();
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onChainBalance, setOnChainBalance] = useState(null);

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    loadBalance();
    loadRewards();
  }, []);

  const loadBalance = async () => {
    const res = await api.student.getBalance(token);
    const data = await res.json();
    setBalance(data.balance);
  };

  const loadLedger = async () => {
    const res = await api.student.getLedger(token);
    const data = await res.json();
    setLedger(data);
  };

  const loadRewards = async () => {
    const res = await api.student.getRewards(token);
    const data = await res.json();
    setRewards(data);
  };

  const loadRedemptions = async () => {
    const res = await api.student.getRedemptions(token);
    const data = await res.json();
    setRedemptions(data);
  };

  const handleRedeem = async (rewardId) => {
    try {
      const res = await api.student.redeem(token, rewardId);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSelectedReward(null);
      loadBalance();
      loadRewards();
      alert('Reward redeemed successfully!');
    } catch (err) {
      alert(err.message);
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
        alert('Please install Petra or Martian wallet extension in your browser.\\n\\nPetra: https://petra.app/\\nMartian: https://martianwallet.xyz/');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      alert('Failed to connect wallet: ' + err.message);
    }
  };

  useEffect(() => {
    if (connected && account?.address) {
      api.student.updateWallet(token, String(account.address))
        .catch(err => console.error("Failed to sync wallet", err));
      
      // Fetch on-chain balance
      const fetchOnChainBalance = async () => {
        try {
          const resource = await client.getAccountResource(
            account.address,
            `${MODULE_ADDRESS}::campus_coin::Balance`
          );
          setOnChainBalance(resource.data.coin.value);
        } catch (e) {
          console.warn("Failed to fetch on-chain balance:", e);
          setOnChainBalance(null);
        }
      };
      fetchOnChainBalance();
    }
  }, [connected, account?.address, token]);

  // Dashboard View
  if (view === 'student-dashboard') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 overflow-hidden shadow-2xl"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
                <p className="text-purple-100">Your Campus Wallet Balance</p>
              </div>

              {/* Wallet Connection */}
              {!connected ? (
                <motion.button
                  onClick={handleConnectWallet}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 md:mt-0 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg"
                >
                  Connect Wallet
                </motion.button>
              ) : (
                <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                  <p className="text-xs text-purple-100 mb-1">Wallet Connected</p>
                  <p className="font-mono text-sm text-white">
                    {account?.address ? `${String(account.address).slice(0, 6)}...${String(account.address).slice(-4)}` : 'Loading...'}
                  </p>
                </div>
              )}
            </div>

            <motion.div
              className="relative z-10 flex items-center space-x-4 mt-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Award className="w-16 h-16 text-yellow-300" />
              <span className="text-6xl font-bold text-white">{balance}</span>
              <span className="text-2xl text-purple-100">Points</span>
            </motion.div>
            
            {connected && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 mt-2 text-center"
              >
                <p className="text-sm text-emerald-400 font-mono bg-emerald-900/30 px-3 py-1 rounded-full inline-block border border-emerald-500/30">
                  On-Chain: {onChainBalance !== null ? onChainBalance : '...'} CW
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Gift, title: 'Marketplace', desc: 'Redeem rewards', view: 'marketplace', gradient: 'from-purple-600 to-blue-600' },
              { icon: TrendingUp, title: 'History', desc: 'View transactions', view: 'ledger', action: loadLedger, gradient: 'from-emerald-600 to-teal-600' },
              { icon: Award, title: 'Redemptions', desc: 'Your QR codes', view: 'redemptions', action: loadRedemptions, gradient: 'from-pink-600 to-purple-600' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (item.action) item.action();
                    setView(item.view);
                  }}
                  className="group relative bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all shadow-xl overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <Icon className={`w-12 h-12 bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                  <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Marketplace View
  if (view === 'marketplace') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
          >
            Marketplace
          </motion.h2>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rewards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'food', 'subscription', 'event', 'coupon', 'merchandise'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-gray-900/40 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{reward.name}</h3>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full capitalize">
                      {reward.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{reward.description}</p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                        {reward.pointsCost} pts
                      </span>
                      <span className={`text-xs ${reward.stock === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {reward.stock === -1 ? 'Unlimited Stock' : `${reward.stock} left in stock`}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedReward(reward)}
                      disabled={balance < reward.pointsCost}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      Redeem
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Redeem Modal */}
          <AnimatePresence>
            {selectedReward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedReward(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-gray-800 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white">Confirm Redemption</h3>
                    <button onClick={() => setSelectedReward(null)} className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <img src={selectedReward.imageUrl} alt={selectedReward.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                    <p className="text-xl font-semibold text-white mb-2">{selectedReward.name}</p>
                    <p className="text-gray-400">{selectedReward.description}</p>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {selectedReward.pointsCost} pts
                   </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedReward(null)}
                      className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRedeem(selectedReward._id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      Confirm
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

  // Ledger View
  if (view === 'ledger') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
          >
            Transaction History
          </motion.h2>

          <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
            {ledger.length === 0 ? (
              <div className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No transactions yet</p>
              </div>
            ) : (
              ledger.map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800 last:border-b-0 p-6 flex justify-between items-center hover:bg-gray-800/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      entry.type === 'EARN' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {entry.type === 'EARN' ? (
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Gift className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{entry.description}</p>
                      <p className="text-sm text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${entry.type === 'EARN' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {entry.type === 'EARN' ? '+' : '-'}{entry.amount}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Redemptions View
  if (view === 'redemptions') {
    return (
      <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
        <VantaWavesBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
          >
            My Redemptions
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {redemptions.map((red, index) => (
              <motion.div
                key={red._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-800 p-8 shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">{red.rewardId?.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    red.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    red.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {red.status}
                  </span>
                </div>

                {red.qrCode && (
                  <div className="bg-white rounded-2xl p-4 mb-4">
                    <img src={red.qrCode} alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Redemption Code</p>
                    <p className="font-mono text-lg text-white">{red.redemptionCode}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Redeemed on:</span>
                    <span className="text-white">{new Date(red.redeemedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {redemptions.length === 0 && (
            <div className="text-center py-20">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No redemptions yet</p>
              <button
                onClick={() => setView('marketplace')}
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg inline-flex items-center gap-2"
              >
                Visit Marketplace <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
