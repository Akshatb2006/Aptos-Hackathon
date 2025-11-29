import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Gift, TrendingUp } from 'lucide-react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { MODULE_ADDRESS } from '../../aptosConfig';

const AdminDashboard = ({ analytics }) => {
  const { account, connect, disconnect, isConnected } = useWalletConnection();

  return (
    <div className="relative overflow-x-hidden">
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
          {!isConnected ? (
            <motion.button
              onClick={connect}
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
                <div className={`w-2 h-2 rounded-full ${String(account?.address) === MODULE_ADDRESS ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                <div>
                  <p className="text-xs text-purple-200">
                    {String(account?.address) === MODULE_ADDRESS ? 'Connected as Admin' : 'Wrong Wallet Connected'}
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
};

export default AdminDashboard;
