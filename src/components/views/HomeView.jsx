import { useState, useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ALBUMS } from '../../data/constants';
import SongRow from '../shared/SongRow';
import AlbumCard from '../shared/AlbumCard';

export default function HomeView() {
  const { allSongs } = usePlayer();
  const [currentMood, setCurrentMood] = useState('all');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  }, []);

  const filteredSongs = useMemo(() => {
    const songs = Array.isArray(allSongs) ? allSongs : [];
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    if (currentMood === 'all') return shuffled.slice(0, 8);
    return shuffled.filter(s => s && (s.mood === currentMood || s.genre === currentMood)).slice(0, 8);
  }, [currentMood, allSongs]);

  const moods = [
    { key: 'all', label: 'All' },
    { key: 'happy', label: 'Happy ☀️' },
    { key: 'chill', label: 'Chill 🌊' },
    { key: 'sad', label: 'Melancholic 🌧️' },
    { key: 'energy', label: 'Energy ⚡' },
    { key: 'tamil', label: 'Tamil 🎶' },
  ];

  const shuffledAlbums = useMemo(() => {
    const list = [...ALBUMS];
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    
    songsArr.forEach(song => {
      if (!song || !song.album || song.album.toLowerCase().trim() === 'single') return;
      const normAlbum = song.album.toLowerCase().trim();
      const exists = list.some(a => a.name.toLowerCase().trim() === normAlbum);
      if (!exists) {
        let emoji = '💿';
        if (song.genre === 'tamil') emoji = '🌺';
        else if (song.genre === 'chill') emoji = '☕';
        else if (song.genre === 'hindi') emoji = '🧡';
        else if (song.genre === 'malayalam') emoji = '🌴';

        list.push({
          id: `dyn_alb_${song.album.toLowerCase().replace(/[^a-z0-9]/g, '').trim()}`,
          name: song.album,
          artist: song.artist || 'Various Artists',
          emoji: emoji,
          gradient: '#1a2a3a,#2d5a6e',
          songs: []
        });
      }
    });

    return [...list].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [allSongs]);

  return (
    <div className="view active" id="view-home">
      <div className="view-header">
        <h1 className="greeting">{greeting}</h1>
        <p className="greeting-sub">What would you like to hear?</p>
      </div>

      <section className="section">
        <h2 className="section-title">Mood Picks</h2>
        <div className="mood-chips">
          {moods.map(m => (
            <button
              key={m.key}
              className={`mood-chip ${currentMood === m.key ? 'active' : ''}`}
              onClick={() => setCurrentMood(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Featured Albums</h2>
        <div className="album-grid">
          {shuffledAlbums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Trending Now</h2>
        <div className="song-list">
          {filteredSongs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎵</div>
              <p>No songs found</p>
            </div>
          ) : (
            filteredSongs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} queue={filteredSongs} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
