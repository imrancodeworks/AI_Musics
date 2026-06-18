import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import SongRow from '../shared/SongRow';

export default function LibraryView() {
  const { playlists, likedSongs, recentlyPlayed, createPlaylist, allSongs } = usePlayer();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('playlists');

  const tabs = [
    { key: 'playlists', label: 'Playlists' },
    { key: 'liked', label: 'Liked Songs' },
    { key: 'history', label: 'History' },
  ];

  const renderContent = () => {
    if (currentTab === 'playlists') {
      if (!playlists.length) {
        return (
          <div className="empty-state">
            <div className="empty-state-icon">🎵</div>
            <p>No playlists yet</p>
            <small>Create your first playlist!</small>
            <br />
            <button
              className="create-playlist-btn"
              style={{ margin: '16px auto 0', display: 'inline-flex' }}
              onClick={() => createPlaylist()}
            >
              + New Playlist
            </button>
          </div>
        );
      }
      const plArr = Array.isArray(playlists) ? playlists : [];
      return (
        <div className="album-grid">
          {plArr.map(p => (
            <div key={p.id} className="album-card" onClick={() => navigate(`/playlist/${p.id}`)}>
              <div className="album-cover">
                <div
                  className="album-art"
                  style={{ background: 'linear-gradient(135deg,var(--lavender-100),var(--biscuit-100))', fontSize: 48 }}
                >
                  🎵
                </div>
              </div>
              <div className="album-info">
                <div className="album-name">{p.name}</div>
                <div className="album-artist">{(p.songs?.length || 0)} songs</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (currentTab === 'liked') {
      const songsArr = Array.isArray(allSongs) ? allSongs : [];
      const songs = likedSongs.map(id => songsArr.find(s => s && (s.id === id || s._id === id))).filter(Boolean);
      if (!songs.length) {
        return (
          <div className="empty-state">
            <div className="empty-state-icon">💜</div>
            <p>No liked songs yet</p>
            <small>Heart songs you love</small>
          </div>
        );
      }
      return (
        <div className="song-list">
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} queue={songs} />
          ))}
        </div>
      );
    }

    if (currentTab === 'history') {
      const songsArr = Array.isArray(allSongs) ? allSongs : [];
      const songs = recentlyPlayed.map(id => songsArr.find(s => s && (s.id === id || s._id === id))).filter(Boolean);
      if (!songs.length) {
        return (
          <div className="empty-state">
            <div className="empty-state-icon">🕑</div>
            <p>No listening history</p>
            <small>Play some songs to start tracking</small>
          </div>
        );
      }
      return (
        <div className="song-list">
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} queue={songs} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="view active" id="view-library">
      <div className="view-header">
        <h1>Your Library</h1>
      </div>
      <div className="library-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`lib-tab ${currentTab === t.key ? 'active' : ''}`}
            onClick={() => setCurrentTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}
