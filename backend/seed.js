const mongoose = require('mongoose');
const config = require('./config');
const Reward = require('./models/Reward');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const UserReward = require('./models/UserReward');

const rewards = [
  { title: '$5 Off Your Purchase', description: 'Get $5 off on any purchase of $25 or more', points: 500, category: 'discount', expiresIn: '30 days', featured: true },
  { title: '$10 Gift Card', description: 'Digital gift card valid on all products', points: 1000, category: 'gift_card', expiresIn: '60 days', featured: true },
  { title: 'Free Shipping', description: 'Free standard shipping on your next order', points: 300, category: 'shipping', expiresIn: '14 days', featured: false },
  { title: '$25 Gift Card', description: 'Premium digital gift card for loyal members', points: 2500, category: 'gift_card', expiresIn: '90 days', featured: true },
  { title: '20% Off Coupon', description: '20% discount on a single item', points: 800, category: 'discount', expiresIn: '21 days', featured: true },
  { title: '$50 Gift Card', description: 'Premium gift card for top members', points: 5000, category: 'gift_card', expiresIn: '120 days', featured: false },
];

async function seed() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Reward.deleteMany({});
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await UserReward.deleteMany({});
    console.log('✅ Cleared existing data');

    // Seed rewards
    const seededRewards = await Reward.insertMany(rewards);
    console.log('✅ Seeded', rewards.length, 'rewards');

    // Create demo user (password: demo123)
    const demoUser = new User({
      firstName: 'John',
      lastName: 'Demo',
      email: 'demo@sharprewards.com',
      password: 'demo123',
      phone: '555-123-4567',
      points: 2750,
      totalEarned: 4250,
      totalRedeemed: 1500,
    });
    await demoUser.save();
    console.log('✅ Created demo user: demo@sharprewards.com / demo123');

    // Create demo transactions
    const now = new Date();
    const transactions = [
      { userId: demoUser._id, type: 'earned', title: 'Welcome Bonus', description: 'Thanks for joining Sharp Rewards!', points: 500, createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Grocery Store - Receipt #4521', points: 125, createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Electronics Store - Receipt #7832', points: 350, createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Bonus Points', description: 'Double points weekend promotion', points: 500, createdAt: new Date(now - 18 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'redeemed', title: '$5 Off Coupon Redeemed', description: 'Code: RSHP-ABC12345', points: -500, createdAt: new Date(now - 15 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Coffee Shop - Receipt #1234', points: 75, createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Department Store - Receipt #9876', points: 425, createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Referral Bonus', description: 'Friend signup: Sarah M.', points: 250, createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'redeemed', title: '$10 Gift Card Redeemed', description: 'Code: RSHP-XYZ98765', points: -1000, createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Pharmacy - Receipt #5555', points: 180, createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Gas Station - Receipt #3333', points: 95, createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Birthday Bonus', description: 'Happy Birthday from Sharp Rewards!', points: 1000, createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) },
      { userId: demoUser._id, type: 'earned', title: 'Receipt Scan', description: 'Restaurant - Receipt #7777', points: 250, createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
    ];

    await Transaction.insertMany(transactions);
    console.log('✅ Seeded', transactions.length, 'transactions');

    // Create a redeemed reward for demo user
    const userReward = new UserReward({
      userId: demoUser._id,
      rewardId: seededRewards[0]._id,
      title: '$5 Off Your Purchase',
      description: 'Get $5 off on any purchase of $25 or more',
      code: 'RSHP-DEMO1234',
      expiresAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      status: 'active'
    });
    await userReward.save();
    console.log('✅ Created demo user reward');

    console.log('\n🎉 Seed complete!\n');
    console.log('Demo Account:');
    console.log('  Email: demo@sharprewards.com');
    console.log('  Password: demo123');
    console.log('  Points: 2,750');
    console.log('  Tier: Bronze\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
