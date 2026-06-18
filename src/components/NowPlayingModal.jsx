import { usePlayer } from '../context/PlayerContext';
import { useUI } from '../context/UIContext';
import { genGradient, formatTime } from '../data/constants';

export default function NowPlayingModal() {
  const { 
    currentSong, isPlaying, progress, 
    togglePlay, nextSong, prevSong, 
    shuffle, repeat, toggleShuffle, toggleRepeat, 
    likedSongs, toggleLike, seekTo 
  } = usePlayer();
  
  const { isNowPlayingOpen, toggleNowPlaying } = useUI();

  if (!isNowPlayingOpen || !currentSong) return null;
  
  const isLiked = likedSongs.includes(currentSong.id || currentSong._id);
  const pct = currentSong.duration ? (progress / currentSong.duration) * 100 : 0;

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(clickPct);
  };

  return (
    <div className="now-playing-modal" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: `linear-gradient(135deg, ${genGradient(currentSong.emoji)}, #0d0d0d)`,
      zIndex: 9999, display: 'flex', flexDirection: 'column', padding: '40px',
      boxSizing: 'border-box', color: 'white', overflow: 'hidden',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100vh); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .np-back-btn:hover { background: rgba(255,255,255,0.1); }
      `}</style>

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
        <button onClick={toggleNowPlaying} className="np-back-btn" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 10, borderRadius: '50%' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 12, fontWeight: 600 }}>
          Now Playing from {currentSong.album || 'Library'}
        </div>
        <div style={{ width: 32 }}></div>
      </div>

      {/* Big Art */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, margin: '20px 0' }}>
        <div style={{
          width: 'min(60vh, 70vw)', height: 'min(60vh, 70vw)', 
          background: `rgba(0,0,0,0.2)`, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', fontSize: 'min(25vh, 25vw)',
          overflow: 'hidden', flexShrink: 0
        }}>
          {currentSong.coverUrl ? (
            <img src={currentSong.coverUrl} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            currentSong.emoji
          )}
        </div>
      </div>

      {/* Meta & Controls */}
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', marginBottom: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '0 0 10px 0', fontWeight: 800 }}>{currentSong.title}</h1>
            <h2 style={{ fontSize: '1.2rem', margin: 0, opacity: 0.7, fontWeight: 500 }}>{currentSong.artist}</h2>
          </div>
          <button 
            onClick={() => toggleLike(currentSong.id || currentSong._id)} 
            style={{ background: 'transparent', border: 'none', color: isLiked ? 'var(--accent)' : 'white', cursor: 'pointer' }}
          >
             <svg viewBox="0 0 20 20" width="32" height="32">
                <path d="M10 17s-7-4.5-7-9a4 4 0 017-2.65A4 4 0 0117 8c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.3" fill={isLiked ? 'currentColor' : 'none'} />
             </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="progress-wrap" style={{ margin: '20px 0' }}>
          <span className="time">{formatTime(progress)}</span>
          <div className="progress-bar" onClick={handleSeek} style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--text)' }}></div>
            <div className="progress-thumb" style={{ left: `${pct}%`, width: 16, height: 16, marginTop: -8 }}></div>
          </div>
          <span className="time">{formatTime(currentSong.duration)}</span>
        </div>

        {/* Play Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 30 }}>
          <button className={`ctrl-btn ${shuffle ? 'active' : ''}`} onClick={toggleShuffle} title="Shuffle" style={{ width: 40, height: 40 }}>
            <svg viewBox="0 0 20 20" width="24" height="24">
              <path d="M3 6h3l7 8h4M17 6h-4l-3 3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M14 4l3 2-3 2M14 14l3 2-3 2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button className="ctrl-btn" onClick={prevSong} style={{ width: 48, height: 48 }}>
            <svg viewBox="0 0 20 20" width="32" height="32">
              <path d="M4 5v10M7 10l9-5v10z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="play-pause-btn" onClick={togglePlay} style={{ width: 64, height: 64, background: 'var(--text)', color: 'var(--bg)' }}>
            {isPlaying ? (
              <svg viewBox="0 0 20 20" width="32" height="32">
                <rect x="5" y="3" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="11" y="3" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" width="32" height="32">
                <path d="M7 4l10 6-10 6z" fill="currentColor" />
              </svg>
            )}
          </button>

          <button className="ctrl-btn" onClick={nextSong} style={{ width: 48, height: 48 }}>
            <svg viewBox="0 0 20 20" width="32" height="32">
              <path d="M16 5v10M13 10L4 5v10z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
            </svg>
          </button>

          <button className={`ctrl-btn ${repeat ? 'active' : ''}`} onClick={toggleRepeat} title="Repeat" style={{ width: 40, height: 40 }}>
            <svg viewBox="0 0 20 20" width="24" height="24">
              <path d="M3 9V7a2 2 0 012-2h10M17 11v2a2 2 0 01-2 2H5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M14 4l3 3-3 3M6 14l-3 2 3 2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
