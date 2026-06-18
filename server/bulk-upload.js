// ====================================================
// BULK TAMIL SONG UPLOADER
// Scans D:\ → uploads to Cloudinary → saves to DB
// ====================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const http = require('http');

// ── Cloudinary Config ────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const API_BASE   = 'http://localhost:3002/api';
const SCAN_DIR   = 'D:\\';
const CONCURRENCY = 3; // Upload 3 songs at a time

// ── Helpers ──────────────────────────────────────────

// Strips site watermarks and cleans filename into a proper title
function cleanTitle(filename) {
  let name = path.basename(filename, '.mp3');
  name = name.replace(/-?MassTamilan\.[a-z]+/gi, '');
  name = name.replace(/-?MassTamilan/gi, '');
  name = name.replace(/\s*\(PenduJatt\.Com\.Se\)/gi, '');
  name = name.replace(/\s*\(KoshalWorld\.Com\)/gi, '');
  name = name.replace(/SpotiDown\.App\s*-\s*/gi, '');
  name = name.replace(/\s*-?\s*\(Raag\.Fm\)/gi, '');
  name = name.replace(/\s*-\s*feat\..*$/gi, '');
  name = name.replace(/\s*\d+\s*Kbps/gi, '');
  name = name.replace(/^\d+-Satranga/gi, 'Satranga');
  name = name.replace(/\(From Kabir Singh\)/gi, '');
  name = name.replace(/\(The Return of Maari\)/gi, '');
  name = name.replace(/Edward Maya, Vika Jigulina - /gi, '');
  name = name.replace(/\[Lyrics\]/gi, '');
  name = name.replace(/MADA TRANCE Ft Dabzee \(Pulimada\) Jojugeorge/gi, 'Mada Trance');
  name = name.replace(/LOS VOLTAJE \(Ultra Slowed\)/gi, 'Los Voltaje');
  name = name.replace(/MalayalamMusic\.In/gi, '');
  name = name.replace(/SambalpuriStar\.In/gi, '');
  name = name.replace(/PagalHits/gi, '');
  name = name.replace(/Mr-Jat\.in/gi, '');
  name = name.replace(/MassTamilan\.io/gi, '');
  name = name.replace(/MassTamilan\.co/gi, '');
  name = name.replace(/MassTamilan\.org/gi, '');
  name = name.replace(/MassTamilan\.so/gi, '');
  name = name.replace(/MassTamilan\.fm/gi, '');
  name = name.replace(/MassTamilan\.dev/gi, '');
  name = name.replace(/MassTamilan\.com/gi, '');
  name = name.replace(/-/g, ' ');
  name = name.replace(/\(\)/g, '');
  name = name.replace(/\s+/g, ' ').trim();
  // Title case
  return name.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Smart metadata parser based on filename watermarks and keywords
function parseSongMetadata(filename) {
  const clean = cleanTitle(filename);
  const lower = filename.toLowerCase();
  
  let artist = 'Various Artists';
  let genre = 'pop';
  let emoji = '🎵';
  let album = 'Single';
  let mood = 'chill';
  
  // Detect artist
  if (lower.includes('satranga') || lower.includes('channa') || lower.includes('deva-deva') || lower.includes('animal')) {
    artist = 'Arijit Singh';
    genre = 'hindi';
    emoji = '🧡';
    mood = 'romantic';
    if (lower.includes('satranga')) album = 'Animal';
    if (lower.includes('channa')) album = 'Ae Dil Hai Mushkil';
    if (lower.includes('deva')) album = 'Brahmastra';
  } else if (
    lower.includes('aagayam') || lower.includes('aalaporan') || lower.includes('aaruyire') || 
    lower.includes('aayiram') || lower.includes('anbe-aaruyire') || lower.includes('munbe') || 
    lower.includes('uyire') || lower.includes('kaatrai') || lower.includes('roja') || 
    lower.includes('bombay') || lower.includes('ennodu')
  ) {
    artist = 'A.R. Rahman';
    genre = 'tamil';
    emoji = '🌺';
    mood = 'romantic';
    if (lower.includes('munbe')) album = 'Sillunu Oru Kaadhal';
    if (lower.includes('roja')) album = 'Roja';
    if (lower.includes('bombay')) album = 'Bombay';
  } else if (
    lower.includes('aaluma') || lower.includes('chumma') || lower.includes('hukum') || 
    lower.includes('vandha') || lower.includes('vaathi') || lower.includes('selfie') || 
    lower.includes('maari') || lower.includes('bagulu') || lower.includes('don\'u')
  ) {
    artist = 'Anirudh Ravichander';
    genre = 'tamil';
    emoji = '⚡';
    mood = 'energy';
    if (lower.includes('hukum')) album = 'Jailer';
    if (lower.includes('vaathi')) album = 'Master';
    if (lower.includes('selfie')) album = 'Kaththi';
  } else if (lower.includes('appadi') || lower.includes('arjunar')) {
    artist = 'Vidyasagar';
    genre = 'tamil';
    emoji = '🔥';
    album = 'Ghilli';
    mood = 'energy';
  } else if (lower.includes('neethaane') || lower.includes('velicha')) {
    artist = 'G.V. Prakash';
    genre = 'tamil';
    emoji = '🌼';
    mood = 'romantic';
  } else if (lower.includes('kannaana') || lower.includes('maruvaarthai')) {
    artist = 'D. Imman';
    genre = 'tamil';
    emoji = '🎶';
    mood = 'sad';
  } else if (lower.includes('aval')) {
    artist = 'Santhosh Narayanan';
    genre = 'tamil';
    emoji = '💜';
    mood = 'chill';
  } else if (lower.includes('stereo')) {
    artist = 'Edward Maya';
    genre = 'pop';
    emoji = '💿';
    mood = 'energy';
  } else if (lower.includes('maroon') || lower.includes('animals')) {
    artist = 'Maroon 5';
    genre = 'pop';
    emoji = '🐾';
    mood = 'energy';
    album = 'V';
  } else if (lower.includes('starboy')) {
    artist = 'The Weeknd';
    genre = 'pop';
    emoji = '🌆';
    mood = 'energy';
    album = 'Starboy';
  } else if (lower.includes('bekhayali')) {
    artist = 'Sachet Tandon';
    genre = 'hindi';
    emoji = '💔';
    mood = 'sad';
    album = 'Kabir Singh';
  } else if (lower.includes('chammak')) {
    artist = 'Akon';
    genre = 'hindi';
    emoji = '✨';
    mood = 'happy';
    album = 'Ra.One';
  } else if (lower.includes('saiyaara') || lower.includes('humsafar')) {
    artist = 'Mohit Chauhan';
    genre = 'hindi';
    emoji = '💫';
    mood = 'romantic';
    album = 'Ek Tha Tiger';
  } else if (lower.includes('ranjha')) {
    artist = 'B Praak';
    genre = 'hindi';
    emoji = '🌟';
    mood = 'romantic';
    album = 'Shershaah';
  } else if (lower.includes('meri-aashiqui')) {
    artist = 'Jubin Nautiyal';
    genre = 'hindi';
    emoji = '🌹';
    mood = 'romantic';
  } else if (lower.includes('tujh mein rab')) {
    artist = 'Roop Kumar Rathod';
    genre = 'hindi';
    emoji = '🙏';
    mood = 'romantic';
    album = 'Rab Ne Bana Di Jodi';
  } else if (lower.includes('jimikki')) {
    artist = 'Shaan Rahman';
    genre = 'malayalam';
    emoji = '👂';
    mood = 'happy';
  } else if (lower.includes('kudukku')) {
    artist = 'Vineeth Sreenivasan';
    genre = 'malayalam';
    emoji = '🍷';
    mood = 'happy';
  } else if (lower.includes('mada trance') || lower.includes('dabzee')) {
    artist = 'Dabzee';
    genre = 'malayalam';
    emoji = '🥁';
    mood = 'energy';
  } else if (lower.includes('heat waves')) {
    artist = 'Glass Animals';
    genre = 'pop';
    emoji = '🌊';
    mood = 'chill';
  } else {
    // General classification by watermarks
    if (lower.includes('masstamilan') || lower.includes('raag.fm')) {
      artist = 'Tamil Artist';
      genre = 'tamil';
      emoji = '🌺';
      mood = 'romantic';
    } else if (lower.includes('pendujatt') || lower.includes('koshalworld') || lower.includes('pagalhits') || lower.includes('mr-jat')) {
      artist = 'Hindi Artist';
      genre = 'hindi';
      emoji = '🎵';
      mood = 'chill';
    } else if (lower.includes('malayalammusic') || lower.includes('jackson') || lower.includes('jimikki')) {
      artist = 'Malayalam Artist';
      genre = 'malayalam';
      emoji = '🌴';
      mood = 'happy';
    } else {
      artist = 'Various Artists';
      genre = 'pop';
      emoji = '🎵';
      mood = 'chill';
    }
  }

  return { title: clean, artist, genre, emoji, album, mood };
}

// Estimate duration from file size (assumes ~128kbps avg bitrate)
function estimateDuration(filepath) {
  const stats = fs.statSync(filepath);
  const bytesPerSec = (128 * 1000) / 8;
  return Math.max(60, Math.round(stats.size / bytesPerSec));
}

// ── API Helpers ───────────────────────────────────────
function apiGet(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3002${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve([]); }
      });
    }).on('error', reject);
  });
}

function apiPost(endpoint, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost', port: 3002,
      path: endpoint, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function apiPut(endpoint, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost', port: 3002,
      path: endpoint, method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Concurrency Runner ────────────────────────────────
async function runConcurrent(tasks, limit) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

// ── Main ──────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   🎵 BULK MUSIC UPLOADER - A&I Music ║');
  console.log('╚══════════════════════════════════════╝\n');

  // 1. Scan D:\ for all MP3s
  console.log(`🔍 Scanning ${SCAN_DIR} for MP3 files...`);
  let allFiles;
  try {
    allFiles = fs.readdirSync(SCAN_DIR)
      .filter(f => f.toLowerCase().endsWith('.mp3'))
      .map(f => path.join(SCAN_DIR, f));
  } catch (err) {
    console.error(`❌ Cannot read ${SCAN_DIR}: ${err.message}`);
    process.exit(1);
  }

  console.log(`📁 Total MP3 files on D:\\   : ${allFiles.length}`);

  if (allFiles.length === 0) {
    console.log('\n⚠️  No MP3 files found on D:\\.');
    return;
  }

  // 3. Fetch existing DB songs to avoid duplicates
  console.log('\n📡 Connecting to database...');
  let existingSongs = [];
  try {
    existingSongs = await apiGet('/api/songs');
    console.log(`✅ Database connected — ${existingSongs.length} songs already in DB\n`);
  } catch {
    console.log('⚠️  Could not reach DB, will create all as new songs\n');
  }

  // 4. Show what will be uploaded
  console.log('═══════════════════════════════════════════');
  console.log(' Songs to upload:');
  console.log('═══════════════════════════════════════════');
  allFiles.forEach((f, i) => {
    const meta = parseSongMetadata(path.basename(f));
    const sizeMB = (fs.statSync(f).size / (1024 * 1024)).toFixed(1);
    const exists = existingSongs.find(s =>
      s.title.toLowerCase().replace(/\s+/g, '') === meta.title.toLowerCase().replace(/\s+/g, '')
    );
    const tag = exists ? (exists.audioUrl ? '[SKIP-HAS-AUDIO]' : '[UPDATE]') : '[NEW]';
    console.log(` ${String(i+1).padStart(3)}. ${tag.padEnd(18)} ${meta.title} — ${meta.artist} [${meta.genre.toUpperCase()}] (${sizeMB}MB)`);
  });
  console.log('═══════════════════════════════════════════\n');

  // 5. Upload
  let uploaded = 0, updated = 0, skipped = 0, failed = 0;
  const startTime = Date.now();

  const tasks = allFiles.map((filepath, index) => async () => {
    const filename = path.basename(filepath);
    const meta     = parseSongMetadata(filename);
    const duration = estimateDuration(filepath);
    const num      = `[${String(index + 1).padStart(3)}/${allFiles.length}]`;

    // Check if already has audio in DB
    const existing = existingSongs.find(s =>
      s.title.toLowerCase().replace(/\s+/g, '') === meta.title.toLowerCase().replace(/\s+/g, '')
    );
    if (existing && existing.audioUrl) {
      skipped++;
      console.log(`${num} ⏭️  SKIP  (already has audio): ${meta.title}`);
      return;
    }

    try {
      process.stdout.write(`${num} ⬆️  Uploading: ${meta.title} (${meta.artist}) ...`);

      const result = await cloudinary.uploader.upload(filepath, {
        resource_type: 'video',
        folder: 'aimi_music_audio',
        use_filename: true,
        unique_filename: true
      });

      const audioUrl = result.secure_url;

      if (existing) {
        // Update existing song record with the audio URL
        await apiPut(`/api/songs/${existing._id}`, { audioUrl });
        updated++;
        console.log(` ✅ UPDATED`);
      } else {
        // Create a brand-new song record
        await apiPost('/api/songs', {
          title: meta.title,
          artist: meta.artist,
          album:  meta.album,
          genre:  meta.genre,
          mood:   meta.mood,
          duration,
          emoji:  meta.emoji,
          audioUrl
        });
        uploaded++;
        console.log(` ✅ ADDED`);
      }
    } catch (err) {
      failed++;
      console.log(` ❌ FAILED — ${err.message}`);
    }
  });

  console.log(`🚀 Starting upload — ${CONCURRENCY} songs at a time...\n`);
  await runConcurrent(tasks, CONCURRENCY);

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const mins    = Math.floor(elapsed / 60);
  const secs    = elapsed % 60;

  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║           🎉 UPLOAD COMPLETE!         ║`);
  console.log(`╠══════════════════════════════════════╣`);
  console.log(`║  ✅ New songs added  : ${String(uploaded).padEnd(15)}║`);
  console.log(`║  🔄 Songs updated   : ${String(updated).padEnd(15)}║`);
  console.log(`║  ⏭️  Skipped (done)  : ${String(skipped).padEnd(15)}║`);
  console.log(`║  ❌ Failed          : ${String(failed).padEnd(15)}║`);
  console.log(`║  ⏱️  Time taken      : ${String(`${mins}m ${secs}s`).padEnd(15)}║`);
  console.log(`╚══════════════════════════════════════╝\n`);
}

main().catch(err => {
  console.error('\n💥 Fatal Error:', err.message);
  process.exit(1);
});
