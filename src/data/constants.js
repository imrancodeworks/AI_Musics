/* ===== A&I MUSIC — DATA CONSTANTS ===== */

export const SONGS = [
  { id:1,  title:'Blinding Lights',      artist:'The Weeknd',       album:'After Hours',        genre:'pop',      mood:'energy',    duration:200, emoji:'🌆' },
  { id:2,  title:'As It Was',            artist:'Harry Styles',     album:"Harry's House",      genre:'pop',      mood:'happy',     duration:167, emoji:'🌸' },
  { id:3,  title:'Stay',                 artist:'The Kid LAROI',    album:'F*CK LOVE 3',        genre:'pop',      mood:'sad',       duration:141, emoji:'🌙' },
  { id:4,  title:'Levitating',           artist:'Dua Lipa',         album:'Future Nostalgia',   genre:'pop',      mood:'happy',     duration:203, emoji:'✨' },
  { id:5,  title:'Bad Guy',              artist:'Billie Eilish',    album:'When We All Fall',   genre:'pop',      mood:'energy',    duration:194, emoji:'🖤' },
  { id:6,  title:'Watermelon Sugar',     artist:'Harry Styles',     album:'Fine Line',          genre:'pop',      mood:'happy',     duration:174, emoji:'🍉' },
  { id:7,  title:'Drivers License',      artist:'Olivia Rodrigo',   album:'SOUR',               genre:'pop',      mood:'sad',       duration:242, emoji:'🚗' },
  { id:8,  title:'good 4 u',             artist:'Olivia Rodrigo',   album:'SOUR',               genre:'pop',      mood:'energy',    duration:178, emoji:'💥' },
  { id:9,  title:'Montero',              artist:'Lil Nas X',        album:'Montero',            genre:'pop',      mood:'energy',    duration:137, emoji:'🌈' },
  { id:10, title:'Peaches',              artist:'Justin Bieber',    album:'Justice',            genre:'pop',      mood:'chill',     duration:198, emoji:'🍑' },
  { id:11, title:'Aroha',                artist:'A.R. Rahman',      album:'Roja',               genre:'tamil',    mood:'romantic',  duration:312, emoji:'🌺' },
  { id:12, title:'Munbe Vaa',            artist:'A.R. Rahman',      album:'Sillunu Oru Kaadhal',genre:'tamil',    mood:'romantic',  duration:290, emoji:'💜' },
  { id:13, title:'Ennodu Nee Irundhaal', artist:'A.R. Rahman',      album:'I',                  genre:'tamil',    mood:'happy',     duration:275, emoji:'🎶' },
  { id:14, title:'Neethaane',            artist:'G.V. Prakash',     album:'Neethaane En Ponvasantham', genre:'tamil', mood:'romantic', duration:305, emoji:'🌼' },
  { id:15, title:'Kannaana Kanney',      artist:'D. Imman',         album:'Viswasam',           genre:'tamil',    mood:'sad',       duration:288, emoji:'❤️' },
  { id:16, title:'Maruvaarthai',         artist:'D. Imman',         album:'Enai Noki Paayum Thota', genre:'tamil', mood:'sad',    duration:265, emoji:'🌧️' },
  { id:17, title:'Strawberry Fields',    artist:'Chill Lofi',       album:'Lofi Beats',         genre:'chill',    mood:'chill',     duration:180, emoji:'🍓' },
  { id:18, title:'Coffee Mornings',      artist:'Lofi Girl',        album:'Morning Chill',      genre:'chill',    mood:'chill',     duration:210, emoji:'☕' },
  { id:19, title:'Rainy Day',            artist:'Chill Vibes',      album:'Lo-fi Dreams',       genre:'chill',    mood:'chill',     duration:195, emoji:'🌧️' },
  { id:20, title:'Midnight Study',       artist:'Lofi Cafe',        album:'Study Session',      genre:'chill',    mood:'focus',     duration:220, emoji:'📚' },
  { id:21, title:'Starboy',             artist:'The Weeknd',       album:'Starboy',            genre:'pop',      mood:'energy',    duration:230, emoji:'⭐' },
  { id:22, title:'Industry Baby',        artist:'Lil Nas X',        album:'Montero',            genre:'pop',      mood:'energy',    duration:212, emoji:'🏭' },
  { id:23, title:'Golden Hour',          artist:'JVKE',             album:'this is what golden hour feels like', genre:'pop', mood:'happy', duration:188, emoji:'🌅' },
  { id:24, title:'Flowers',             artist:'Miley Cyrus',      album:'Endless Summer Vacation', genre:'pop', mood:'happy',   duration:200, emoji:'🌻' },
  { id:25, title:'Cruel Summer',        artist:'Taylor Swift',     album:'Lover',              genre:'pop',      mood:'energy',    duration:178, emoji:'☀️' },
  { id:26, title:'Midnight Rain',       artist:'Taylor Swift',     album:'Midnights',          genre:'pop',      mood:'sad',       duration:174, emoji:'🌃' },
  { id:27, title:'Vaseegara',           artist:'Mani Sharma',      album:'Minnale',            genre:'tamil',    mood:'romantic',  duration:320, emoji:'💫' },
  { id:28, title:'Uyire',               artist:'A.R. Rahman',      album:'Bombay',             genre:'tamil',    mood:'romantic',  duration:295, emoji:'🌹' },
];

export const ALBUMS = [
  { id:'a1', name:'After Hours',     artist:'The Weeknd',     emoji:'🌆', gradient:'#1a0533,#4a0e8f', songs:[1,21] },
  { id:'a2', name:'SOUR',            artist:'Olivia Rodrigo', emoji:'🍋', gradient:'#2d1b4e,#7c3aed', songs:[7,8] },
  { id:'a3', name:'Future Nostalgia',artist:'Dua Lipa',       emoji:'💫', gradient:'#0f2044,#1a73e8', songs:[4] },
  { id:'a4', name:'Lofi Beats',      artist:'Chill Lofi',     emoji:'🌙', gradient:'#1a2a3a,#2d5a6e', songs:[17,18,19,20] },
  { id:'a5', name:'Roja',            artist:'A.R. Rahman',    emoji:'🌺', gradient:'#3a1a0a,#8b4513', songs:[11] },
  { id:'a6', name:'Lover',           artist:'Taylor Swift',   emoji:'💕', gradient:'#3d1a2e,#c2185b', songs:[25,26] },
  { id:'a7', name:'Animal',          artist:'Arijit Singh',   emoji:'🧡', gradient:'#3d0d0d,#8b1e1e', songs:[] },
  { id:'a8', name:'Jailer',          artist:'Anirudh Ravichander', emoji:'⚡', gradient:'#1f1c2c,#928dab', songs:[] },
  { id:'a9', name:'Ghilli',          artist:'Vidyasagar',     emoji:'🔥', gradient:'#f12711,#f5af19', songs:[] },
  { id:'a10', name:'Shershaah',      artist:'B Praak',        emoji:'🌟', gradient:'#0f2027,#203a43', songs:[] },
  { id:'a11', name:'Sillunu Oru Kaadhal', artist:'A.R. Rahman', emoji:'💜', gradient:'#2c3e50,#3498db', songs:[12] },
];

export const ARTISTS = [
  { id:'ar1', name:'The Weeknd',    genre:'R&B / Pop',    emoji:'🌆', songs:[1,21] },
  { id:'ar2', name:'Olivia Rodrigo',genre:'Pop / Alt',    emoji:'🍋', songs:[7,8] },
  { id:'ar3', name:'A.R. Rahman',   genre:'Tamil / World', emoji:'🎵', songs:[11,12,13,28] },
  { id:'ar4', name:'Dua Lipa',      genre:'Pop / Dance',  emoji:'💫', songs:[4] },
  { id:'ar5', name:'Taylor Swift',  genre:'Pop / Country', emoji:'💕', songs:[25,26] },
  { id:'ar6', name:'Harry Styles',  genre:'Pop / Rock',   emoji:'🌸', songs:[2,6] },
  { id:'ar7', name:'Billie Eilish', genre:'Alt / Pop',    emoji:'🖤', songs:[5] },
  { id:'ar8', name:'D. Imman',      genre:'Tamil / Film',  emoji:'🎶', songs:[15,16] },
];

// Helper functions
export function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function genGradient(emoji) {
  const map = {
    '🌆':'#1a0533', '🌸':'#3a1628', '🌙':'#0d1b2a', '✨':'#1a1040',
    '🖤':'#1a1a1a', '🍉':'#2d0a1a', '🚗':'#1a0d2e', '💥':'#2d1a00',
    '🌈':'#2d0a2d', '🍑':'#3a1a00', '🌺':'#3a1000', '💜':'#2d1040',
    '🎶':'#1a2a0a', '🌼':'#2d2a00', '❤️':'#3a0a0a', '🌧️':'#0a1a2a',
    '🍓':'#3a0a1a', '☕':'#2a1a0a', '📚':'#0a1a2a', '⭐':'#2a1a00',
    '🏭':'#1a1a1a', '🌅':'#2a1a00', '🌻':'#2a1a00', '☀️':'#2a1000',
    '🌃':'#0a0a2a', '💫':'#1a0a3a', '🌹':'#3a0a0a', '🎵':'#1a0a2a',
    '💕':'#3a0a2a'
  };
  return map[emoji] || '#1a1a2e';
}
