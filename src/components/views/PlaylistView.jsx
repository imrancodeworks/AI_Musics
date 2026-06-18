import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import SongRow from '../shared/SongRow';

export default function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, playSong, deletePlaylist, allSongs } = usePlayer();

  const playlist = useMemo(() => playlists.find(p => p.id === id), [playlists, id]);
  const songs = useMemo(() => {
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    const mapped = playlist ? playlist.songs.map(songId => songsArr.find(s => s && (s.id === songId || s._id === songId))).filter(Boolean) : [];
    return [...mapped].sort(() => 0.5 - Math.random());
  }, [playlist, allSongs]);

  if (!playlist) return null;

  return (
    <div className="view active" id="view-playlist">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 20 20">
          <path d="M13 4l-7 6 7 6" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>
      <div className="playlist-hero">
        <div className="playlist-icon">🎵</div>
        <div className="playlist-hero-info">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 6 }}>PLAYLIST</div>
          <h1>{playlist.name}</h1>
          <div className="playlist-hero-count">{songs.length} song{songs.length !== 1 ? 's' : ''}</div>
          <div className="playlist-actions">
            {songs.length > 0 && (
              <button className="btn-play-playlist" onClick={() => playSong(songs[0], songs)}>
                ▶ Play
              </button>
            )}
            <button className="btn-delete-playlist" onClick={() => { deletePlaylist(playlist.id); navigate('/library'); }}>
              Delete Playlist
            </button>
          </div>
        </div>
      </div>
      {songs.length > 0 ? (
        <div className="song-list">
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} queue={songs} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <p>This playlist is empty</p>
          <small>Add songs using the ⊕ button</small>
        </div>
      )}
    </div>
  );
}
