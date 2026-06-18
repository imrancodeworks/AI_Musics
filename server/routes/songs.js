const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../songs-backup.json');

async function saveBackup() {
  try {
    const songs = await Song.find({});
    fs.writeFileSync(backupPath, JSON.stringify(songs, null, 2));
    console.log(`💾 Persistent backup saved: ${songs.length} songs`);
  } catch (err) {
    console.error('Failed to save persistent backup:', err.message);
  }
}

// GET all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new song
router.post('/', upload.any(), async (req, res) => {
  try {
    console.log('--- [SONGS POST] ---');
    console.log('FILES:', req.files?.map(f => ({ field: f.fieldname, file: f.originalname })));
    console.log('BODY:', req.body);
    
    let audioUrl = req.body.audioUrl || '';
    let coverUrl = req.body.coverUrl || '';
    
    const audioFile = req.files?.find(f => f.fieldname === 'audioFile');
    const coverFile = req.files?.find(f => f.fieldname === 'coverFile');
    
    if (audioFile) {
      // Upload to Cloudinary. resource_type 'video' is required for audio files.
      const result = await cloudinary.uploader.upload(audioFile.path, {
        resource_type: 'video',
        folder: 'aimi_music_audio'
      });
      audioUrl = result.secure_url;
      
      // Remove temp file
      try { fs.unlinkSync(audioFile.path); } catch(e) {}
    }

    if (coverFile) {
      const result = await cloudinary.uploader.upload(coverFile.path, {
        resource_type: 'image',
        folder: 'aimi_music_covers'
      });
      coverUrl = result.secure_url;
      try { fs.unlinkSync(coverFile.path); } catch(e) {}
    }

    const songData = {
      ...req.body,
      audioUrl,
      coverUrl
    };

    const song = new Song(songData);
    const newSong = await song.save();
    await saveBackup();
    res.status(201).json(newSong);
  } catch (err) {
    if (req.files) {
      if (req.files.audioFile && req.files.audioFile.length > 0 && fs.existsSync(req.files.audioFile[0].path)) {
        try { fs.unlinkSync(req.files.audioFile[0].path); } catch(e) { console.error('Cleanup error:', e); }
      }
      if (req.files.coverFile && req.files.coverFile.length > 0 && fs.existsSync(req.files.coverFile[0].path)) {
        try { fs.unlinkSync(req.files.coverFile[0].path); } catch(e) { console.error('Cleanup error:', e); }
      }
    }
    console.error('Upload Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a song
router.put('/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSong) return res.status(404).json({ message: 'Song not found' });
    await saveBackup();
    res.json(updatedSong);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a song
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    await saveBackup();
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST seed data
router.post('/seed', async (req, res) => {
  try {
    const defaultSongs = [
      { title:'Blinding Lights',      artist:'The Weeknd',       album:'After Hours',        genre:'pop',      mood:'energy',    duration:200, emoji:'🌆' },
      { title:'As It Was',            artist:'Harry Styles',     album:"Harry's House",      genre:'pop',      mood:'happy',     duration:167, emoji:'🌸' },
      { title:'Stay',                 artist:'The Kid LAROI',    album:'F*CK LOVE 3',        genre:'pop',      mood:'sad',       duration:141, emoji:'🌙' },
      { title:'Levitating',           artist:'Dua Lipa',         album:'Future Nostalgia',   genre:'pop',      mood:'happy',     duration:203, emoji:'✨' },
      { title:'Bad Guy',              artist:'Billie Eilish',    album:'When We All Fall',   genre:'pop',      mood:'energy',    duration:194, emoji:'🖤' },
      { title:'Watermelon Sugar',     artist:'Harry Styles',     album:'Fine Line',          genre:'pop',      mood:'happy',     duration:174, emoji:'🍉' },
      { title:'Drivers License',      artist:'Olivia Rodrigo',   album:'SOUR',               genre:'pop',      mood:'sad',       duration:242, emoji:'🚗' },
      { title:'good 4 u',             artist:'Olivia Rodrigo',   album:'SOUR',               genre:'pop',      mood:'energy',    duration:178, emoji:'💥' },
      { title:'Montero',              artist:'Lil Nas X',        album:'Montero',            genre:'pop',      mood:'energy',    duration:137, emoji:'🌈' },
      { title:'Peaches',              artist:'Justin Bieber',    album:'Justice',            genre:'pop',      mood:'chill',     duration:198, emoji:'🍑' },
      { title:'Aroha',                artist:'A.R. Rahman',      album:'Roja',               genre:'tamil',    mood:'romantic',  duration:312, emoji:'🌺' },
      { title:'Munbe Vaa',            artist:'A.R. Rahman',      album:'Sillunu Oru Kaadhal',genre:'tamil',    mood:'romantic',  duration:290, emoji:'💜' },
      { title:'Ennodu Nee Irundhaal', artist:'A.R. Rahman',      album:'I',                  genre:'tamil',    mood:'happy',     duration:275, emoji:'🎶' },
      { title:'Neethaane',            artist:'G.V. Prakash',     album:'Neethaane En Ponvasantham', genre:'tamil', mood:'romantic', duration:305, emoji:'🌼' },
      { title:'Kannaana Kanney',      artist:'D. Imman',         album:'Viswasam',           genre:'tamil',    mood:'sad',       duration:288, emoji:'❤️' },
      { title:'Maruvaarthai',         artist:'D. Imman',         album:'Enai Noki Paayum Thota', genre:'tamil', mood:'sad',    duration:265, emoji:'🌧️' },
      { title:'Strawberry Fields',    artist:'Chill Lofi',       album:'Lofi Beats',         genre:'chill',    mood:'chill',     duration:180, emoji:'🍓' },
      { title:'Coffee Mornings',      artist:'Lofi Girl',        album:'Morning Chill',      genre:'chill',    mood:'chill',     duration:210, emoji:'☕' },
      { title:'Rainy Day',            artist:'Chill Vibes',      album:'Lo-fi Dreams',       genre:'chill',    mood:'chill',     duration:195, emoji:'🌧️' },
      { title:'Midnight Study',       artist:'Lofi Cafe',        album:'Study Session',      genre:'chill',    mood:'focus',     duration:220, emoji:'📚' },
      { title:'Starboy',             artist:'The Weeknd',       album:'Starboy',            genre:'pop',      mood:'energy',    duration:230, emoji:'⭐' },
      { title:'Industry Baby',        artist:'Lil Nas X',        album:'Montero',            genre:'pop',      mood:'energy',    duration:212, emoji:'🏭' },
      { title:'Golden Hour',          artist:'JVKE',             album:'this is what golden hour feels like', genre:'pop', mood:'happy', duration:188, emoji:'🌅' },
      { title:'Flowers',             artist:'Miley Cyrus',      album:'Endless Summer Vacation', genre:'pop', mood:'happy',   duration:200, emoji:'🌻' },
      { title:'Cruel Summer',        artist:'Taylor Swift',     album:'Lover',              genre:'pop',      mood:'energy',    duration:178, emoji:'☀️' },
      { title:'Midnight Rain',       artist:'Taylor Swift',     album:'Midnights',          genre:'pop',      mood:'sad',       duration:174, emoji:'🌃' },
      { title:'Vaseegara',           artist:'Mani Sharma',      album:'Minnale',            genre:'tamil',    mood:'romantic',  duration:320, emoji:'💫' },
      { title:'Uyire',               artist:'A.R. Rahman',      album:'Bombay',             genre:'tamil',    mood:'romantic',  duration:295, emoji:'🌹' }
    ];
    
    // Clear existing
    await Song.deleteMany({});
    
    // Insert defaults
    const inserted = await Song.insertMany(defaultSongs);
    await saveBackup();
    res.status(201).json({ message: 'Database seeded!', count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DIAGNOSTIC ROUTE
router.post('/diagnostic', upload.any(), (req, res) => {
  console.log('!!! DIAGNOSTIC HIT !!!');
  console.log('Fields:', Object.keys(req.body));
  console.log('Files:', req.files?.map(f => f.fieldname));
  res.json({
    receivedBody: Object.keys(req.body),
    receivedFiles: req.files?.map(f => f.fieldname)
  });
});

module.exports = router;
