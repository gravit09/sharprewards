const express = require('express');
const authMiddleware = require('../middleware/auth');
const Reward = require('../models/Reward');
const UserReward = require('../models/UserReward');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const rewards = await Reward.find({ active: true }).sort({ featured: -1, points: 1 });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-rewards', authMiddleware, async (req, res) => {
  try {
    const userRewards = await UserReward.find({ userId: req.userId, status: 'active' }).sort({ createdAt: -1 });
    res.json(userRewards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/redeem/:rewardId', authMiddleware, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward || !reward.active) return res.status(404).json({ message: 'Reward not found' });
    const user = req.user;
    if (user.points < reward.points) return res.status(400).json({ message: 'Insufficient points' });
    user.points -= reward.points;
    user.totalRedeemed += reward.points;
    await user.save();
    const code = 'RSHP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const userReward = await UserReward.create({
      userId: user._id, rewardId: reward._id, title: reward.title,
      description: reward.description, code, expiresAt
    });
    await Transaction.create({
      userId: user._id, type: 'redeemed', title: `${reward.title} Redeemed`,
      description: `Code: ${code}`, points: -reward.points
    });
    res.json({ message: 'Reward redeemed!', reward: userReward, newBalance: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
