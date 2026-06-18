import { useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useUI } from '../context/UIContext';
import { formatTime, genGradient } from '../data/constants';

export default function PlayerBar() {
  const {
    currentSong, isPlaying, shuffle, repeat, progress, volume,
    togglePlay, nextSong, prevSong, toggleShuffle, toggleRepeat,
    toggleLike, likedSongs, setVolume, seekTo,
  } = usePlayer();
  const { toggleNowPlaying } = useUI();

  const isLiked = currentSong && likedSongs.includes(currentSong.id || currentSong._id);
  const pct = currentSong ? (progress / currentSong.duration) * 100 : 0;

  const handleSeek = useCallback((e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(clickPct);
  }, [seekTo]);

  return (
    <footer className="player-bar" id="playerBar">
      <div className="player-info-container" style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
        <div 
          className="player-info" 
          onClick={currentSong ? toggleNowPlaying : undefined}
          style={{ cursor: currentSong ? 'pointer' : 'default', display: 'flex', alignItems: 'center', width: '100%', transition: 'transform 0.2s', padding: 5, borderRadius: 8 }}
          onMouseOver={(e) => currentSong && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseOut={(e) => currentSong && (e.currentTarget.style.background = 'transparent')}
        >
          <div className="player-thumb" id="playerThumb">
            {currentSong ? (
              currentSong.coverUrl ? (
                <img src={currentSong.coverUrl} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : (
                <div
                  className="thumb-placeholder"
                  style={{
                    background: genGradient(currentSong.emoji),
                    fontSize: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {currentSong.emoji}
                </div>
              )
            ) : (
              <div className="thumb-placeholder"></div>
            )}
          </div>
          <div className="player-meta">
            <div className="player-song">{currentSong?.title || 'Select a song'}</div>
            <div className="player-artist">{currentSong?.artist || '—'}</div>
          </div>
        </div>
        <button
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => toggleLike(currentSong.id || currentSong._id)}
          style={{ marginLeft: 10 }}
        >
          <svg viewBox="0 0 20 20">
            <path d="M10 17s-7-4.5-7-9a4 4 0 017-2.65A4 4 0 0117 8c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.3" fill={isLiked ? 'currentColor' : 'none'} />
          </svg>
        </button>
      </div>

      <div className="player-controls">
        <button className={`ctrl-btn ${shuffle ? 'active' : ''}`} onClick={toggleShuffle} id="shuffleBtn" title="Shuffle">
          <svg viewBox="0 0 20 20">
            <path d="M3 6h3l7 8h4M17 6h-4l-3 3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M14 4l3 2-3 2M14 14l3 2-3 2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="ctrl-btn" onClick={prevSong}>
          <svg viewBox="0 0 20 20">
            <path d="M4 5v10M7 10l9-5v10z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="play-pause-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 20 20">
              <rect x="5" y="3" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="11" y="3" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20">
              <path d="M7 4l10 6-10 6z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button className="ctrl-btn" onClick={nextSong}>
          <svg viewBox="0 0 20 20">
            <path d="M16 5v10M13 10L4 5v10z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
          </svg>
        </button>
        <button className={`ctrl-btn ${repeat ? 'active' : ''}`} onClick={toggleRepeat} id="repeatBtn" title="Repeat">
          <svg viewBox="0 0 20 20">
            <path d="M3 9V7a2 2 0 012-2h10M17 11v2a2 2 0 01-2 2H5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M14 4l3 3-3 3M6 14l-3 2 3 2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="player-right">
        <div className="progress-wrap">
          <span className="time">{formatTime(progress)}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
            <div className="progress-thumb" style={{ left: `${pct}%` }}></div>
          </div>
          <span className="time">{currentSong ? formatTime(currentSong.duration) : '0:00'}</span>
        </div>
        <div className="volume-wrap">
          <svg viewBox="0 0 20 20" width="14" height="14">
            <path d="M4 8v4h3l4 3V5L7 8H4z" fill="currentColor" />
            <path d="M13 7a3 3 0 010 6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
          />
        </div>
      </div>
    </footer>
  );
}
