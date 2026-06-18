import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useUI } from './UIContext';
import axios from 'axios';
import { SONGS as STATIC_SONGS } from '../data/constants';
import API_BASE_URL from '../config';

const FALLBACK_AUDIO_URL = 'https://res.cloudinary.com/djs4euftl/video/upload/v1775241858/aimi_music_audio/j1p73c4hyfkbpccn04xb.mp3';

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const { notify, setPendingPlaylistSong, closeModal } = useUI();
  
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  
  // Initialize with static constants so UI is never blank on first load
  const [allSongs, setAllSongs] = useState(STATIC_SONGS);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  
  // Real Audio Element
  const audioRef = useRef(new Audio());

  // Normalize MongoDB _id to id for consistent use across the app
  const normalizeSong = (song) => ({
    ...song,
    id: song.id || song._id,
  });

  // Fetch songs from API — use full URL directly, no dependency on axios.defaults.baseURL timing
  const fetchSongs = useCallback(() => {
    axios.get(`${API_BASE_URL}/songs`)
      .then(res => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setAllSongs(data.map(normalizeSong));
        } else {
          console.warn('API returned empty or non-array, keeping current songs');
        }
      })
      .catch(err => {
        console.error('Failed to fetch songs from API:', err.message);
      });
  }, []);

  // Fetch on mount
  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  // Load from backend on mount
  useEffect(() => {
    axios.get('/playlists')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPlaylists(data);
        } else {
          console.warn('API did not return an array of playlists');
          setPlaylists([]);
        }
      })
      .catch(e => {
        console.error('Failed to load playlists', e);
        setPlaylists([]);
      });
      
    axios.get('/user')
      .then(res => {
        const data = res.data;
        if(data.likedSongs) setLikedSongs(data.likedSongs);
        if(data.recentlyPlayed) setRecentlyPlayed(data.recentlyPlayed);
      })
      .catch(e => console.error('Failed to load user info', e));
  }, []);

  // Sync state to backend when data changes
  useEffect(() => {
    if(likedSongs.length >= 0) {
      axios.post('/user/likes', { likedSongs }).catch(e => console.error(e));
    }
  }, [likedSongs]);

  useEffect(() => {
    if(recentlyPlayed.length >= 0) {
      axios.post('/user/recent', { recentlyPlayed }).catch(e => console.error(e));
    }
  }, [recentlyPlayed]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleEnded = () => handleNextSong();
    const handleVolumeChange = () => {
      // Only set UI volume if it differs to avoid recursive loop
      if (Math.abs(audio.volume * 100 - volume) > 0.1) {
        setVolume(audio.volume * 100);
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [queue, queueIndex, repeat, shuffle]); // Dependencies that nextSong might need

  // Sync volume
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const handleNextSong = useCallback(() => {
    setQueue(q => {
      const currentIdx = queueIndex;
      if (!q.length) return q;
      
      let nextIdx;
      if (shuffle) {
        nextIdx = Math.floor(Math.random() * q.length);
      } else {
        nextIdx = (currentIdx + 1) % q.length;
      }
      
      const nextS = q[nextIdx];
      setCurrentSong(nextS);
      setQueueIndex(nextIdx);
      
      const audio = audioRef.current;
      const url = nextS.audioUrl || FALLBACK_AUDIO_URL;
      audio.src = url;
      audio.play().catch(e => console.log('Audio play error:', e));
      setIsPlaying(true);
      if (!nextS.audioUrl) {
        notify(`Playing demo audio for ${nextS.title}`);
      }
      return q;
    });
  }, [queueIndex, shuffle, notify]);

  const nextSong = useCallback(() => handleNextSong(), [handleNextSong]);

  const playSong = useCallback((song, queueOverride) => {
    if (queueOverride) {
      setQueue(queueOverride);
      const idx = queueOverride.findIndex(s => (s.id || s._id) === (song.id || song._id));
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const idx = queue.findIndex(s => (s.id || s._id) === (song.id || song._id));
      setQueueIndex(idx >= 0 ? idx : 0);
    }
    
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);

    setRecentlyPlayed(prev => [song.id, ...prev.filter(id => id !== song.id)].slice(0, 12));

    const audio = audioRef.current;
    const url = song.audioUrl || FALLBACK_AUDIO_URL;
    audio.src = url;
    audio.play().catch(e => console.log('Audio play error:', e));
    if (!song.audioUrl) {
      notify(`Playing demo audio for ${song.title}`);
    }
  }, [queue, notify]);

  const togglePlay = useCallback(() => {
    if (!currentSong && queue.length) {
      playSong(queue[0]);
      return;
    }
    const audio = audioRef.current;
    setIsPlaying(prev => {
      if (prev) {
        audio.pause();
      } else if (currentSong?.audioUrl) {
        audio.play().catch(e => console.log('Audio play error:', e));
      }
      return !prev;
    });
  }, [currentSong, queue, playSong]);

  const prevSong = useCallback(() => {
    if (!currentSong) return;
    if (progress > 5 && currentSong.audioUrl) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    setQueue(q => {
      const idx = (queueIndex - 1 + q.length) % q.length;
      const prevS = q[idx];
      setCurrentSong(prevS);
      setQueueIndex(idx);
      
      const audio = audioRef.current;
      const url = prevS.audioUrl || FALLBACK_AUDIO_URL;
      audio.src = url;
      audio.play().catch(e => console.log('Audio play error:', e));
      setIsPlaying(true);
      if (!prevS.audioUrl) {
        notify(`Playing demo audio for ${prevS.title}`);
      }
      return q;
    });
  }, [currentSong, progress, queueIndex, notify]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      notify(!prev ? 'Shuffle on' : 'Shuffle off');
      return !prev;
    });
  }, [notify]);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
        const audio = audioRef.current;
        audio.loop = !prev;
        notify(!prev ? 'Repeat on' : 'Repeat off');
        return !prev;
    });
  }, [notify]);

  const toggleLike = useCallback((songId) => {
    const id = songId || currentSong?.id;
    if (!id) return;
    setLikedSongs(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) {
        notify('Added to Liked Songs');
        return [...prev, id];
      } else {
        notify('Removed from Liked Songs');
        return prev.filter(x => x !== id);
      }
    });
  }, [notify, currentSong]);

  const seekTo = useCallback((pct) => {
    if (!currentSong) return;
    const time = pct * currentSong.duration;
    if (currentSong.audioUrl) {
      audioRef.current.currentTime = time;
    }
    setProgress(time);
  }, [currentSong]);

  const jumpTime = useCallback((amount) => {
    if (!currentSong) return;
    const audio = audioRef.current;
    if (currentSong.audioUrl) {
      let newTime = audio.currentTime + amount;
      if (newTime < 0) newTime = 0;
      if (newTime > currentSong.duration) newTime = currentSong.duration;
      audio.currentTime = newTime;
      setProgress(newTime);
    } else {
      setProgress(prev => {
        let newTime = prev + amount;
        if(newTime < 0) newTime = 0;
        if(newTime > currentSong.duration) newTime = currentSong.duration;
        return newTime;
      });
    }
  }, [currentSong]);

  // Playlist management
  const createPlaylist = useCallback((name) => {
    const n = name || prompt('Playlist name:');
    if (!n || !n.trim()) return null;
    const playlist = { id: 'pl_' + Date.now(), name: n.trim(), songs: [], created: Date.now() };
    setPlaylists(prev => [playlist, ...prev]);
    
    axios.post('/playlists', playlist).catch(e => console.error(e));

    notify(`Playlist "${n}" created`);
    return playlist;
  }, [notify]);

  const deletePlaylist = useCallback((plId) => {
    if (!confirm('Delete this playlist?')) return;
    setPlaylists(prev => prev.filter(p => p.id !== plId));
    axios.delete(`/playlists/${plId}`).catch(e => console.error(e));

    notify('Playlist deleted');
  }, [notify]);

  const addSongToPlaylist = useCallback((plId, pendingSongId) => {
    setPlaylists(prev => {
      const pl = prev.find(p => p.id === plId);
      if(!pl) return prev;
      if (pl.songs.includes(pendingSongId)) {
        notify('Already in playlist');
        return prev;
      }
      
      const updatedSongs = [...pl.songs, pendingSongId];
      axios.put(`/playlists/${plId}`, { name: pl.name, songs: updatedSongs }).catch(e => console.error(e));
      
      notify(`Added to ${pl.name}`);
      return prev.map(p => p.id === plId ? { ...p, songs: updatedSongs } : p);
    });
    closeModal();
  }, [notify, closeModal]);

  const createPlaylistFromModal = useCallback((pendingSongId) => {
    const pl = createPlaylist();
    if (pl && pendingSongId) {
      setTimeout(() => {
        setPlaylists(prev => {
          return prev.map(p => {
             if(p.id === pl.id) {
               const updated = { ...p, songs: [...p.songs, pendingSongId] };
               axios.put(`/playlists/${pl.id}`, { name: updated.name, songs: updated.songs }).catch(e => console.error(e));
               return updated;
             }
             return p;
          });
        });
      }, 100);
    }
    closeModal();
  }, [createPlaylist, closeModal]);

  // Simulate progress manually IF NO AUDIO URL
  useEffect(() => {
    if (!currentSong || currentSong.audioUrl || !isPlaying) return;
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= currentSong.duration) {
           if(repeat) return 0;
           handleNextSong();
           return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSong, isPlaying, handleNextSong, repeat]);

  const value = {
    allSongs, currentSong, queue, queueIndex, isPlaying, shuffle, repeat,
    volume, progress, playlists, likedSongs, recentlyPlayed,
    playSong, togglePlay, nextSong, prevSong, toggleShuffle, toggleRepeat,
    toggleLike, setVolume, seekTo, jumpTime,
    createPlaylist, deletePlaylist, addSongToPlaylist, createPlaylistFromModal,
    fetchSongs
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
