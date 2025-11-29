import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const ManageRewards = ({ rewards, onCreateReward }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    category: 'food',
    stock: -1,
    imageUrl: ''
  });

  const handleCreate = () => {
    onCreateReward(formData)
      .then(() => {
        alert('Reward created!');
        setFormData({ name: '', description: '', pointsCost: 0, category: 'food', stock: -1, imageUrl: '' });
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="relative overflow-x-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Manage Rewards
        </motion.h2>

        {/* Create Reward Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-400" />
            Create New Reward
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
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
              onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) })}
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
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="food">Food</option>
              <option value="subscription">Subscription</option>
              <option value="event">Event</option>
              <option value="coupon">Coupon</option>
              <option value="merchandise">Merchandise</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="md:col-span-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows="3"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
          >
            Create Reward
          </motion.button>
        </motion.div>

        {/* Existing Rewards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-gray-800 shadow-xl overflow-hidden"
            >
              <div className="flex items-start gap-4">
                {reward.imageUrl && (
                  <img src={reward.imageUrl} alt={reward.name} className="w-16 h-16 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">{reward.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${reward.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {reward.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-purple-400">{reward.pointsCost} pts</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 capitalize block">{reward.category}</span>
                      <span className={`text-xs ${reward.stock === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {reward.stock === -1 ? 'Unlimited Stock' : `${reward.stock} left in stock`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageRewards;
