module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sharp-rewards',
  JWT_SECRET: process.env.JWT_SECRET || 'sharp_rewards_jwt_secret_key_2026',
  PORT: process.env.PORT || 3000
};
