const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

mongoose.connect('mongodb://localhost:27017/aimi_music').then(async () => {
  const Song = require('./models/Song');
  const count = await Song.countDocuments();
  const withAudio = await Song.countDocuments({ audioUrl: { $ne: '' } });
  const sample = await Song.find().limit(5);
  console.log('TOTAL SONGS IN DB:', count);
  console.log('SONGS WITH AUDIO:', withAudio);
  console.log('SAMPLE SONGS:', sample.map(s => ({ title: s.title, artist: s.artist, audioUrl: s.audioUrl ? 'HAS-AUDIO' : 'NO-AUDIO' })));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
