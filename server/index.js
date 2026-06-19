const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Logger
app.use((req, res, next) => {
  console.log(`>>> Incoming: ${req.method} ${req.path}`);
  next();
});

// 2. CORS — allow both localhost (dev) and deployed frontend (prod)
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global Unhandled Rejection Log
process.on('unhandledRejection', (reason) => {
  console.error('!!! UNHANDLED REJECTION:', reason);
});

// Routes
const songsRouter = require('./routes/songs');
const playlistsRouter = require('./routes/playlists');
const userRouter = require('./routes/user');

app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/user', userRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── DATABASE CONNECTION (cached for serverless warm re-use) ──
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return; // Reuse existing connection on warm invocations

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set. Add it to Vercel environment variables.');
  }

  console.log('⏳ Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 15000
  });
  isConnected = true;
  console.log('✅ Connected to MongoDB Atlas');

  // AUTO-RESTORE from backup JSON (only runs in non-serverless / local mode)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const fs = require('fs');
      const Song = require('./models/Song');
      const count = await Song.countDocuments();
      const backupFile = path.join(__dirname, 'songs-backup.json');

      if (fs.existsSync(backupFile)) {
        const data = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📡 Found persistent backup with ${data.length} songs.`);
          if (count === 0) {
            console.log('🔄 Database is empty. Restoring backup songs...');
            await Song.insertMany(data);
            console.log('✅ Auto-restore complete!');
          } else if (count < data.length) {
            console.log(`🔄 Merging ${data.length - count} missing songs from backup...`);
            for (const s of data) {
              const exists = await Song.exists({ _id: s._id });
              if (!exists) await new Song(s).save();
            }
            console.log('✅ Auto-merge complete!');
          }
        }
      }
    } catch (restoreErr) {
      console.error('⚠️ Auto-restore failed:', restoreErr.message);
    }
  }
};

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Server Error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    field: err.field || null
  });
});

// ── STARTUP ──
// On Vercel: module is imported, so we connect then export.
// Locally: we connect then listen.
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // Serverless — connect eagerly and export the app
  connectDB().catch(console.error);
  module.exports = app;
} else {
  // Local dev — connect then start HTTP server
  const PORT = process.env.PORT || 3002;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });

  module.exports = app;
}
