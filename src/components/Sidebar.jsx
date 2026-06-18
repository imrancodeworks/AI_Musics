import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { useUI } from '../context/UIContext';

export default function Sidebar() {
  const { playlists, recentlyPlayed, createPlaylist, playSong, allSongs } = usePlayer();
  const { theme, toggleTheme, eyeCare, toggleEyeCare } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: 'home', label: 'Home', icon: <path d="M3 10.5L10 3l7 7.5V18h-5v-4H8v4H3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /> },
    { key: 'search', label: 'Search', icon: <><circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></> },
    { key: 'library', label: 'Library', icon: <><rect x="3" y="4" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><rect x="8.5" y="4" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M14 5l3 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></> },
    { key: 'artists', label: 'Artists', icon: <><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></> },
    { key: 'ai', label: 'AI Mix', icon: <><path d="M10 3a7 7 0 100 14A7 7 0 0010 3z" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></> },
  ];

  const songsArr = Array.isArray(allSongs) ? allSongs : [];
  const recentSongs = Array.isArray(recentlyPlayed) 
    ? recentlyPlayed.map(id => songsArr.find(s => s && (s.id === id || s._id === id))).filter(Boolean).slice(0, 6)
    : [];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src="/Gemini_Generated_Image_54rqsu54rqsu54rq.png" alt="A&I Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <span className="logo-text">A<span className="logo-amp">&amp;</span>I</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`nav-item ${
              (location.pathname === '/' && item.key === 'home') || 
              location.pathname === '/' + item.key ? 'active' : ''
            }`}
            data-view={item.key}
            onClick={() => navigate(item.key === 'home' ? '/' : `/${item.key}`)}
          >
            <svg viewBox="0 0 20 20">{item.icon}</svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <div className="section-label">PLAYLISTS</div>
        <div className="playlist-list">
          {(Array.isArray(playlists) ? playlists : []).map(p => (
            <div key={p.id} className="playlist-item" onClick={() => navigate(`/playlist/${p.id}`)}>
              <div className="playlist-dot"></div>
              <span className="playlist-item-name">{p.name}</span>
              <span className="playlist-item-count">{p.songs?.length || 0}</span>
            </div>
          ))}
        </div>
        <button className="create-playlist-btn" onClick={() => createPlaylist()}>
          <svg viewBox="0 0 16 16">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Playlist
        </button>
      </div>

      <div className="sidebar-section" style={{ marginTop: 'auto' }}>
        <div className="section-label">RECENTLY PLAYED</div>
        <div className="recent-list">
          {recentSongs.map(s => (
            <div key={s.id} className="recent-item" onClick={() => playSong(s)}>
              {s.emoji} {s.title}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
