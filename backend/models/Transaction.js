const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['earned', 'redeemed'] },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  points: { type: Number, required: true },
  status: { type: String, default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
