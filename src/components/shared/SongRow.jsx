import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useUI } from '../../context/UIContext';
import { formatTime, genGradient, ARTISTS } from '../../data/constants';

export default function SongRow({ song, index, queue, showNumber = true }) {
  const { currentSong, likedSongs, playSong, toggleLike } = usePlayer();
  const { openAddToPlaylist } = useUI();
  const navigate = useNavigate();
  const isPlaying = currentSong?.id === song.id;

  const handleArtistClick = (e) => {
    e.stopPropagation();
    if (!song.artist) return;

    const normalizeName = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '').trim() : '';
    const norm = normalizeName(song.artist);

    // Look for static artist match
    const staticArtist = ARTISTS.find(a => normalizeName(a.name) === norm);
    if (staticArtist) {
      navigate(`/artist/${staticArtist.id}`);
    } else {
      navigate(`/artist/dyn_art_${norm}`);
    }
  };

  return (
    <div
      className={`song-row ${isPlaying ? 'playing' : ''}`}
      data-song-id={song.id || song._id}
      onClick={() => playSong(song, queue)}
    >
      {showNumber && (
        <div className="song-num">{isPlaying ? '♪' : index + 1}</div>
      )}
      <div className="song-info">
        <div className="song-thumb">
          <div
            className="song-thumb-art"
            style={{ background: `linear-gradient(135deg,${genGradient(song.emoji)},${genGradient(song.emoji)}aa)` }}
          >
            {song.emoji}
          </div>
        </div>
        <div className="song-info-text">
          <div className="song-title">{song.title}</div>
          <div
            className="song-artist clickable-artist"
            onClick={handleArtistClick}
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          >
            {song.artist}
          </div>
        </div>
      </div>
      <span className="song-genre-tag">{song.genre}</span>
      <div className="song-actions">
        <button
          className={`song-action-btn ${likedSongs.includes(song.id || song._id) ? 'liked-icon' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleLike(song.id || song._id); }}
          title="Like"
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M10 17s-7-4.5-7-9a4 4 0 017-2.65A4 4 0 0117 8c0 4.5-7 9-7 9z"
              stroke="currentColor" strokeWidth="1.3"
              fill={likedSongs.includes(song.id || song._id) ? 'currentColor' : 'none'}
            />
          </svg>
        </button>
        <button
          className="song-action-btn"
          onClick={(e) => { e.stopPropagation(); openAddToPlaylist(song.id || song._id); }}
          title="Add to playlist"
        >
          <svg viewBox="0 0 20 20">
            <path d="M3 6h14M3 10h10M3 14h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <path d="M16 12.5v1.5l1 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="song-duration">{formatTime(song.duration)}</div>
    </div>
  );
}
