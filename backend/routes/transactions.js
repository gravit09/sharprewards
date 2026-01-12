const express = require('express');
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { userId: req.userId };
    if (type && type !== 'all') query.type = type;
    const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const transactions = await Transaction.find({ userId: req.userId, createdAt: { $gte: startOfMonth } });
    const earnedThisMonth = transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0);
    const redeemedThisMonth = transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.points), 0);
    res.json({ earnedThisMonth, redeemedThisMonth });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
