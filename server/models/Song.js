const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, default: 'Single' },
  genre: { type: String, default: 'unknown' },
  mood: { type: String, default: 'chill' },
  duration: { type: Number, required: true },
  emoji: { type: String, default: '🎵' },
  audioUrl: { type: String, default: '' },
  coverUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', songSchema);
