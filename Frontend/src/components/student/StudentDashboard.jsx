import React from 'react';
import { motion } from 'framer-motion';
import { Award, Gift, TrendingUp, ArrowRight } from 'lucide-react';
import { useWalletConnection } from '../../hooks/useWalletConnection';

const StudentDashboard = ({ user, balance, onChainBalance, setView, loadLedger, loadRedemptions }) => {
  const { connect, isConnected, account } = useWalletConnection();

  return (
    <div className="relative overflow-x-hidden">
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
            {!isConnected ? (
              <motion.button
                onClick={connect}
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
          
          {isConnected && (
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
};

export default StudentDashboard;
