import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const Marketplace = ({ 
  rewards, 
  balance, 
  onRedeem, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  const [selectedReward, setSelectedReward] = useState(null);

  const handleRedeemClick = () => {
    if (selectedReward) {
      onRedeem(selectedReward._id)
        .then(() => {
          alert('Reward redeemed successfully!');
          setSelectedReward(null);
        })
        .catch(err => alert(err.message));
    }
  };

  return (
    <div className="relative overflow-x-hidden">
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

        {/* Reward Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-gray-900/40 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all shadow-xl"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                {reward.imageUrl && (
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
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
                    disabled={balance < reward.pointsCost || reward.stock === 0}
                    className="bg-white text-purple-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
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
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-white mb-1">{selectedReward.name}</h4>
                    <p className="text-sm text-gray-400">{selectedReward.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Cost:</span>
                    <span className="text-xl font-bold text-white">{selectedReward.pointsCost} pts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                    <span>Your Balance:</span>
                    <span className="text-white">{balance} pts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-2 pt-2 border-t border-gray-800">
                    <span>Remaining:</span>
                    <span className={`font-bold ${balance - selectedReward.pointsCost < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {balance - selectedReward.pointsCost} pts
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedeemClick}
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
};

export default Marketplace;
