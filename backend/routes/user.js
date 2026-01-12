const express = require('express');
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const tierInfo = user.getTierInfo();
    res.json({
      id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email,
      phone: user.phone, points: user.points, tier: user.tier, tierInfo,
      totalEarned: user.totalEarned, totalRedeemed: user.totalRedeemed,
      memberId: user.memberId, memberSince: user.memberSince
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = req.user;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    const tierInfo = user.getTierInfo();
    res.json({ message: 'Profile updated', user: {
      id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email,
      phone: user.phone, points: user.points, tier: user.tier, tierInfo,
      totalEarned: user.totalEarned, totalRedeemed: user.totalRedeemed,
      memberId: user.memberId, memberSince: user.memberSince
    }});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-points', authMiddleware, async (req, res) => {
  try {
    const { points, title, description } = req.body;
    const user = req.user;
    if (!points || points <= 0) return res.status(400).json({ message: 'Invalid points' });
    user.points += points;
    user.totalEarned += points;
    await user.save();
    await Transaction.create({ userId: user._id, type: 'earned', title: title || 'Points Earned', description: description || '', points });
    res.json({ message: `${points} points added!`, newBalance: user.points, tier: user.tier });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
