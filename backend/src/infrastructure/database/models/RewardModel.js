const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pointsCost: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['food', 'subscription', 'event', 'coupon', 'merchandise'], 
    default: 'food' 
  },
  stock: { type: Number, default: -1 }, 
  active: { type: Boolean, default: true },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', rewardSchema);