const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  points: { type: Number, default: 500 },
  tier: { type: String, default: 'Bronze', enum: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
  totalEarned: { type: Number, default: 500 },
  totalRedeemed: { type: Number, default: 0 },
  memberId: { type: String, unique: true },
  memberSince: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  if (!this.memberId) {
    this.memberId = 'SRP-' + Math.random().toString().slice(2, 11);
  }
  
  if (this.points >= 20000) this.tier = 'Platinum';
  else if (this.points >= 10000) this.tier = 'Gold';
  else if (this.points >= 5000) this.tier = 'Silver';
  else this.tier = 'Bronze';
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getTierInfo = function() {
  const tiers = {
    Bronze: { minPoints: 0, maxPoints: 4999, nextTier: 'Silver', color: '#CD7F32' },
    Silver: { minPoints: 5000, maxPoints: 9999, nextTier: 'Gold', color: '#C0C0C0' },
    Gold: { minPoints: 10000, maxPoints: 19999, nextTier: 'Platinum', color: '#FFD700' },
    Platinum: { minPoints: 20000, maxPoints: 999999, nextTier: null, color: '#E5E4E2' }
  };
  const current = tiers[this.tier];
  const pointsToNextTier = current.nextTier ? (current.maxPoints + 1 - this.points) : 0;
  return { ...current, pointsToNextTier, nextTier: current.nextTier || 'Max Level' };
};

module.exports = mongoose.model('User', userSchema);
