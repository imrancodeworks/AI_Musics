/**
 * clear-users.js
 * 
 * One-time script: deletes ALL user accounts from MongoDB Atlas.
 * Run this locally ONCE before going live on Vercel.
 * 
 * Usage:
 *   cd server
 *   node clear-users.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

async function clearAllUsers() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not set in server/.env');
    process.exit(1);
  }

  console.log('⏳ Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected.');

  const count = await User.countDocuments();
  console.log(`📋 Found ${count} user account(s) in the database.`);

  if (count === 0) {
    console.log('✨ Database already empty — nothing to delete.');
  } else {
    const result = await User.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} user account(s). All login credentials cleared.`);
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected. Done!');
}

clearAllUsers().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
