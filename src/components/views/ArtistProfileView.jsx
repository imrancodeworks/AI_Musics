import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { ARTISTS, genGradient } from '../../data/constants';
import SongRow from '../shared/SongRow';

export default function ArtistProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allSongs } = usePlayer();

  const normalizeName = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '').trim() : '';

  const artist = useMemo(() => {
    // 1. Look in static ARTISTS first
    let found = ARTISTS.find(a => a.id === id);
    if (found) return found;

    // 2. Look in allSongs for a dynamic artist match
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    const targetNorm = id && id.startsWith('dyn_art_') ? id.replace('dyn_art_', '') : normalizeName(id);

    const matchingSong = songsArr.find(s => s && normalizeName(s.artist) === targetNorm);
    if (matchingSong) {
      let emoji = '🎙️';
      if (matchingSong.genre === 'tamil') emoji = '🌺';
      else if (matchingSong.genre === 'chill') emoji = '☕';
      else if (matchingSong.genre === 'hindi') emoji = '🧡';
      else if (matchingSong.genre === 'malayalam') emoji = '🌴';

      return {
        id: id,
        name: matchingSong.artist,
        genre: matchingSong.genre ? matchingSong.genre.toUpperCase() : 'Artist',
        emoji: emoji,
        songs: []
      };
    }

    return null;
  }, [id, allSongs]);

  const songs = useMemo(() => {
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    if (!artist) return [];

    const normArtistName = normalizeName(artist.name);
    const filtered = songsArr.filter(s => s && (
      (artist.songs && artist.songs.includes(s.id)) ||
      (s.artist && normalizeName(s.artist) === normArtistName)
    ));
    return [...filtered].sort(() => 0.5 - Math.random());
  }, [artist, allSongs]);

  const listenerCount = useMemo(() => (Math.random() * 9 + 1).toFixed(1), []);

  if (!artist) return null;

  return (
    <div className="view active" id="view-artist-profile">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 20 20">
          <path d="M13 4l-7 6 7 6" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>
      <div className="artist-hero">
        <div
          className="artist-hero-avatar"
          style={{ background: `linear-gradient(135deg,${genGradient(artist.emoji)}cc,var(--lavender-100))` }}
        >
          {artist.emoji}
        </div>
        <div className="artist-hero-info">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 6 }}>ARTIST</div>
          <h1>{artist.name}</h1>
          <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>{artist.genre}</div>
          <div className="artist-stats">
            <div className="artist-stat">
              <div className="stat-val">{songs.length}</div>
              <div className="stat-label">Songs</div>
            </div>
            <div className="artist-stat">
              <div className="stat-val">{listenerCount}M</div>
              <div className="stat-label">Listeners</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Popular</h2>
        <div className="song-list">
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} queue={songs} />
          ))}
        </div>
      </div>
    </div>
  );
}
