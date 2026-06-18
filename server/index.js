const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Move Logger to the absolute top
app.use((req, res, next) => {
  console.log(`>>> Incoming: ${req.method} ${req.path}`);
  next();
});

// 2. Other Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global Unhandled Rejection Log
process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! UNHANDLED REJECTION:', reason);
});

// Routes
const songsRouter = require('./routes/songs');
const playlistsRouter = require('./routes/playlists');
const userRouter = require('./routes/user');

app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/user', userRouter);

// Database Connection Settings
const connectDB = async () => {
  const fs = require('fs');
  const path = require('path');

  try {
    console.log('⏳ Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      connectTimeoutMS: 10000
    });
    console.log('✅ Success! Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ Atlas Connection Failed:', err.message);
    console.log('⚠️ Warning: Your IP might not be whitelisted. Booting up temporary local fallback database...');
    
    // Automatically fallback to memory server
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);
    console.log('✅ SUCCESS! Connected to local MongoDB Fallback Server.');
    console.log('👉 NOTE: Any data saved now will be cleared when you stop the server.');
  }

  // AUTO-RESTORE LOGIC FROM PERSISTENT BACKUP JSON
  try {
    const Song = require('./models/Song');
    const count = await Song.countDocuments();
    const backupFile = path.join(__dirname, 'songs-backup.json');
    if (fs.existsSync(backupFile)) {
      const data = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        console.log(`📡 Found persistent backup file with ${data.length} songs.`);
        if (count === 0) {
          console.log('🔄 Database is empty. Restoring backup songs...');
          await Song.insertMany(data);
          console.log('✅ Auto-restore complete!');
        } else if (count < data.length) {
          console.log(`🔄 Database has ${count} songs but backup has ${data.length} songs. Merging missing songs...`);
          for (const s of data) {
            const exists = await Song.exists({ _id: s._id });
            if (!exists) {
              await new Song(s).save();
            }
          }
          console.log('✅ Auto-merge complete!');
        }
      }
    }

    // ── DATABASE HEALER: LINK EMPTY SONGS TO REAL AUDIO ──
    const allSongs = await Song.find({});
    const songsWithAudio = allSongs.filter(s => s.audioUrl && !s.audioUrl.includes('djs4euftl'));
    if (songsWithAudio.length > 0) {
      const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '').trim() : '';
      let healedCount = 0;

      for (const song of allSongs) {
        if (!song.audioUrl || song.audioUrl.includes('djs4euftl')) {
          const normTitle = normalize(song.title);
          
          // Try to find a similar title match
          let match = songsWithAudio.find(s => 
            normalize(s.title).includes(normTitle) || 
            normTitle.includes(normalize(s.title))
          );
          
          // If no title match, pick a random song from the same genre
          if (!match) {
            const genreSongs = songsWithAudio.filter(s => s.genre === song.genre);
            if (genreSongs.length > 0) {
              match = genreSongs[Math.floor(Math.random() * genreSongs.length)];
            } else {
              match = songsWithAudio[Math.floor(Math.random() * songsWithAudio.length)];
            }
          }
          
          if (match) {
            song.audioUrl = match.audioUrl;
            await song.save();
            healedCount++;
          }
        }
      }
      if (healedCount > 0) {
        console.log(`🌸 Database Healer: Automatically linked ${healedCount} default/empty songs to real uploaded audio tracks!`);
        // Save the healed state to the backup file
        const fsSongs = await Song.find({});
        fs.writeFileSync(backupFile, JSON.stringify(fsSongs, null, 2));
      }
    }
  } catch (restoreErr) {
    console.error('⚠️ Auto-restore/healer failed:', restoreErr.message);
  }
};

app.use((err, req, res, next) => {
  console.error('🔥 Global Server Error:', err);
  res.status(500).json({ 
    message: err.message || 'Internal Server Error', 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    field: err.field || null 
  });
});

connectDB().then(() => {
  // Start server only after database is ready
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

