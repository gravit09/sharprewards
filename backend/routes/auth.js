const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const config = require('../config');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = new User({ firstName, lastName, email: email.toLowerCase(), password, points: 500 });
    await user.save();
    await Transaction.create({
      userId: user._id, type: 'earned', title: 'Welcome Bonus',
      description: 'Thanks for joining Sharp Rewards!', points: 500
    });
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      message: 'Registration successful', token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email,
        points: user.points, tier: user.tier, memberId: user.memberId }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '30d' });
    const tierInfo = user.getTierInfo();
    res.json({
      message: 'Login successful', token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email,
        phone: user.phone, points: user.points, tier: user.tier, tierInfo,
        totalEarned: user.totalEarned, totalRedeemed: user.totalRedeemed,
        memberId: user.memberId, memberSince: user.memberSince }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
