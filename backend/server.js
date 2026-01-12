const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const rewardsRoutes = require('./routes/rewards');
const transactionsRoutes = require('./routes/transactions');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/transactions', transactionsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sharp Rewards API is running' });
});

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
