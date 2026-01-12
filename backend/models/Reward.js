const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  category: { type: String, required: true, enum: ['discount', 'gift_card', 'shipping', 'exclusive', 'bonus'] },
  expiresIn: { type: String, default: '30 days' },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
