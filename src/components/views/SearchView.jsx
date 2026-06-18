import { useState, useMemo, useCallback, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useUI } from '../../context/UIContext';
import { ALBUMS, ARTISTS, genGradient } from '../../data/constants';
import SongRow from '../shared/SongRow';
import AlbumCard from '../shared/AlbumCard';
import ArtistCard from '../shared/ArtistCard';

export default function SearchView() {
  const { playSong, allSongs } = usePlayer();
  const { notify } = useUI();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [voiceStatus, setVoiceStatus] = useState('');
  const [listening, setListening] = useState(false);
  const debounceRef = useRef(null);
  const [searchQ, setSearchQ] = useState('');

  const handleInput = useCallback((val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQ(val.trim().toLowerCase()), 180);
  }, []);

  const handleFilter = useCallback((f) => {
    setFilter(f);
  }, []);

  const { songs, albums, artists } = useMemo(() => {
    const q = searchQ;
    if (!q) return { songs: [], albums: [], artists: [] };

    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    let filteredSongs = songsArr.filter(s => {
      const matchQ = s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q) || s.album.toLowerCase().includes(q);
      const matchF = filter === 'all' || filter === 'song' ? true : filter === 'artist' ? s.artist.toLowerCase().includes(q) : filter === 'album' ? s.album.toLowerCase().includes(q) : s.genre === filter;
      return matchQ && (filter === 'all' || matchF);
    });

    const filteredAlbums = ALBUMS.filter(a => a.name.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q));
    
    // Build unified artists list
    const list = [...ARTISTS];
    const normalizeName = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '').trim() : '';

    songsArr.forEach(song => {
      if (!song || !song.artist) return;
      const normSongArtist = normalizeName(song.artist);
      if (!normSongArtist) return;

      const exists = list.some(a => normalizeName(a.name) === normSongArtist);
      if (!exists) {
        let emoji = '🎙️';
        if (song.genre === 'tamil') emoji = '🌺';
        else if (song.genre === 'chill') emoji = '☕';
        else if (song.genre === 'hindi') emoji = '🧡';
        else if (song.genre === 'malayalam') emoji = '🌴';

        list.push({
          id: `dyn_art_${normSongArtist}`,
          name: song.artist,
          genre: song.genre ? song.genre.toUpperCase() : 'Artist',
          emoji: emoji,
          songs: []
        });
      }
    });

    const filteredArtists = list.filter(a => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q));

    return { songs: filteredSongs, albums: filteredAlbums, artists: filteredArtists };
  }, [searchQ, filter, allSongs]);

  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { notify('Voice search not supported'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    setListening(true);
    setVoiceStatus('Listening...');
    recognition.start();
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setSearchQ(transcript.toLowerCase());
      setVoiceStatus(`"${transcript}"`);
      setListening(false);
      const t = transcript.toLowerCase();
      if (t.includes('play')) {
        const genreMatch = ['chill', 'tamil', 'pop', 'happy', 'sad', 'energy'].find(g => t.includes(g));
        if (genreMatch) {
          const filtered = allSongs.filter(s => s.genre === genreMatch || s.mood === genreMatch);
          if (filtered.length) { playSong(filtered[0], filtered); notify(`Playing ${genreMatch} songs`); }
        }
      }
    };
    recognition.onerror = () => { setListening(false); setVoiceStatus('Could not hear. Try again.'); };
    recognition.onend = () => { setListening(false); setTimeout(() => setVoiceStatus(''), 3000); };
  }, [playSong, notify]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'song', label: 'Songs' },
    { key: 'artist', label: 'Artists' },
    { key: 'album', label: 'Albums' },
    { key: 'tamil', label: 'Tamil' },
    { key: 'pop', label: 'Pop' },
    { key: 'chill', label: 'Chill' },
  ];

  const suggestedSongs = useMemo(() => {
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    if (songsArr.length === 0) return [];
    return [...songsArr].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [allSongs]);

  const hasResults = songs.length > 0 || albums.length > 0 || artists.length > 0;

  return (
    <div className="view active" id="view-search">
      <div className="view-header">
        <h1>Search</h1>
        <div className="search-bar-wrap">
          <div className="search-bar">
            <svg viewBox="0 0 20 20" className="search-icon">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Songs, artists, albums..."
              value={query}
              onChange={(e) => handleInput(e.target.value)}
            />
            <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={startVoiceSearch} title="Voice Search">
              <svg viewBox="0 0 20 20">
                <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.3" fill="none" />
                <path d="M4 10a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                <path d="M10 16v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="voice-status">{voiceStatus}</div>
        </div>
        <div className="filter-tabs">
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => handleFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results">
        {!searchQ ? (
          <div className="search-empty-state">
            <div className="search-placeholder" style={{ padding: '30px 0 10px' }}>
              <div className="placeholder-icon" style={{ fontSize: 38, marginBottom: 8 }}>🎵</div>
              <p style={{ margin: 0, fontSize: 15, color: 'var(--text-muted)' }}>Search for songs, artists, albums or genres</p>
            </div>
            {suggestedSongs.length > 0 && (
              <div className="section" style={{ marginTop: 24 }}>
                <h2 className="section-title" style={{ fontSize: 16, marginBottom: 12 }}>Suggested Songs</h2>
                <div className="song-list">
                  {suggestedSongs.map((s, i) => (
                    <SongRow key={s.id} song={s} index={i} queue={suggestedSongs} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : !hasResults ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>No results for "{searchQ}"</p>
            <small>Try a different search term</small>
          </div>
        ) : (
          <>
            {artists.length > 0 && (filter === 'all' || filter === 'artist') && (
              <>
                <div className="results-section-title">Artists</div>
                <div className="artist-grid" style={{ marginBottom: 20 }}>
                  {artists.slice(0, 4).map(a => (
                    <ArtistCard key={a.id} artist={a} />
                  ))}
                </div>
              </>
            )}
            {albums.length > 0 && (filter === 'all' || filter === 'album') && (
              <>
                <div className="results-section-title">Albums</div>
                <div className="album-grid" style={{ marginBottom: 24 }}>
                  {albums.slice(0, 4).map(a => (
                    <AlbumCard key={a.id} album={a} />
                  ))}
                </div>
              </>
            )}
            {songs.length > 0 && (
              <>
                <div className="results-section-title">Songs</div>
                <div className="song-list">
                  {songs.map((s, i) => (
                    <SongRow key={s.id} song={s} index={i} queue={songs} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
