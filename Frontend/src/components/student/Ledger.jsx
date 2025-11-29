import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Gift } from 'lucide-react';

const Ledger = ({ ledger }) => {
  return (
    <div className="relative overflow-x-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8"
        >
          Transaction History
        </motion.h2>

        <div className="space-y-4">
          {ledger.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/40 backdrop-blur-2xl rounded-2xl p-6 border border-gray-800 flex items-center justify-between hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${entry.type === 'EARN' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
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
          ))}
          
          {ledger.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ledger;
