const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  magicToken: { type: String, default: null },
  magicTokenExpiry: { type: Date, default: null },
  likedSongs: { type: [String], default: [] },
  recentlyPlayed: { type: [String], default: [] },
  gender: { type: String, enum: ['Male', 'Female', 'Other', null], default: null }
});

module.exports = mongoose.model('User', userSchema);
