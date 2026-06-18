import { useState, useCallback } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import SongRow from '../shared/SongRow';

export default function AIView() {
  const { recentlyPlayed, allSongs } = usePlayer();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const moods = [
    { key: 'happy', label: '😊 Happy' },
    { key: 'chill', label: '😌 Chill' },
    { key: 'sad', label: '😔 Melancholic' },
    { key: 'energy', label: '🔥 Energetic' },
    { key: 'focus', label: '🎯 Focus' },
    { key: 'romantic', label: '💜 Romantic' },
  ];

  const genres = [
    { key: 'all', label: 'All' },
    { key: 'pop', label: 'Pop' },
    { key: 'tamil', label: 'Tamil' },
    { key: 'chill', label: 'Lo-fi' },
    { key: 'classical', label: 'Classical' },
    { key: 'indie', label: 'Indie' },
  ];

  const generateMix = useCallback(() => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      const songsArr = Array.isArray(allSongs) ? allSongs : [];
      let filtered = [...songsArr];
      if (selectedMood) filtered = filtered.filter(s => s && s.mood === selectedMood);
      if (selectedGenre && selectedGenre !== 'all') filtered = filtered.filter(s => s && s.genre === selectedGenre);

      if (recentlyPlayed.length) {
        const recent = recentlyPlayed.slice(0, 5).map(id => songsArr.find(s => s && (s.id === id || s._id === id))).filter(Boolean);
        const genreSet = [...new Set(recent.map(s => s.genre))];
        filtered.sort((a, b) => (genreSet.includes(b.genre) ? 1 : 0) - (genreSet.includes(a.genre) ? 1 : 0));
      }

      if (!filtered.length) filtered = allSongs.slice(0, 8);
      setResults(filtered.slice(0, 8));
      setLoading(false);
      setGenerated(true);
    }, 1200);
  }, [selectedMood, selectedGenre, recentlyPlayed]);

  return (
    <div className="view active" id="view-ai">
      <div className="view-header">
        <h1>AI Music Mix</h1>
        <p className="view-sub">Powered by your listening habits &amp; mood</p>
      </div>
      <div className="ai-panel">
        <div className="ai-mood-section">
          <h3>How are you feeling?</h3>
          <div className="ai-moods">
            {moods.map(m => (
              <button
                key={m.key}
                className={`ai-mood-btn ${selectedMood === m.key ? 'selected' : ''}`}
                onClick={() => setSelectedMood(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ai-genre-section">
          <h3>Preferred genre?</h3>
          <div className="ai-genres">
            {genres.map(g => (
              <button
                key={g.key}
                className={`ai-genre-btn ${selectedGenre === g.key ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g.key)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <button className="ai-generate-btn" onClick={generateMix}>
          <svg viewBox="0 0 20 20" width="18" height="18">
            <path d="M10 2l2.4 4.8 5.3.8-3.85 3.75.9 5.3L10 14.2l-4.75 2.5.9-5.3L2.3 7.6l5.3-.8z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          Generate My Mix
        </button>
        <div className="ai-results">
          {loading && (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <span>Generating your mix...</span>
            </div>
          )}
          {generated && !loading && (
            <>
              <div style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: 13 }}>
                ✨ Based on your {selectedMood || 'listening'} mood{selectedGenre && selectedGenre !== 'all' ? ` · ${selectedGenre}` : ''}
              </div>
              <div className="song-list">
                {results.map((s, i) => (
                  <SongRow key={s.id} song={s} index={i} queue={results} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
