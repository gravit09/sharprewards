const mongoose = require('mongoose');

const userRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  status: { type: String, default: 'active', enum: ['active', 'used', 'expired'] }
}, { timestamps: true });

module.exports = mongoose.model('UserReward', userRewardSchema);
