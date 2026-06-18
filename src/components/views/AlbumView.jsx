import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { ALBUMS } from '../../data/constants';
import SongRow from '../shared/SongRow';

export default function AlbumView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong, allSongs } = usePlayer();

  const album = useMemo(() => {
    // 1. Look in static ALBUMS first
    let found = ALBUMS.find(a => a.id === id);
    if (found) return found;

    // 2. Look in allSongs for a dynamic album match
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    const targetNorm = id && id.startsWith('dyn_alb_') ? id.replace('dyn_alb_', '') : id.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    const matchingSong = songsArr.find(s => s && s.album && s.album.toLowerCase().replace(/[^a-z0-9]/g, '').trim() === targetNorm);
    if (matchingSong) {
      return {
        id: id,
        name: matchingSong.album,
        artist: matchingSong.artist || 'Various Artists',
        emoji: matchingSong.emoji || '💿',
        gradient: '#1a2a3a,#2d5a6e',
        songs: []
      };
    }
    return null;
  }, [id, allSongs]);

  const songs = useMemo(() => {
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    if (!album) return [];

    const normAlbumName = album.name.toLowerCase().trim();
    const filtered = songsArr.filter(s => s && (
      (album.songs && album.songs.includes(s.id)) ||
      (s.album && s.album.toLowerCase().trim() === normAlbumName)
    ));
    return [...filtered].sort(() => 0.5 - Math.random());
  }, [album, allSongs]);

  if (!album) return null;

  return (
    <div className="view active" id="view-album">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 20 20">
          <path d="M13 4l-7 6 7 6" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>
      <div className="gradient-header" style={{ background: `linear-gradient(135deg,${album.gradient})` }}>
        <div className="album-hero">
          <div
            className="album-hero-art"
            style={{ background: `linear-gradient(135deg,${album.gradient}cc,#fff1)` }}
          >
            {album.emoji}
          </div>
          <div className="album-hero-info">
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 6 }}>ALBUM</div>
            <h1 style={{ color: '#fff' }}>{album.name}</h1>
            <div className="album-hero-meta" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {album.artist} • {songs.length} songs
            </div>
            {songs.length > 0 && (
              <button
                className="album-play-all"
                onClick={() => playSong(songs[0], songs)}
              >
                ▶ Play All
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="section">
        <div className="song-list">
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} queue={songs} />
          ))}
        </div>
      </div>
    </div>
  );
}
