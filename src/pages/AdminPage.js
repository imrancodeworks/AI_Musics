import { useState, useEffect } from 'react';
import axios from 'axios';
import { genGradient, formatTime } from '../data/constants';
import API_BASE_URL from '../config';

export default function AdminPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '', artist: '', album: '', genre: 'pop', mood: 'chill', duration: 180, emoji: '🎵', audioUrl: ''
  });

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/songs`);
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSongs(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('artist', formData.artist);
      data.append('album', formData.album);
      data.append('genre', formData.genre);
      data.append('mood', formData.mood);
      data.append('duration', Number(formData.duration));
      data.append('emoji', formData.emoji);
      
      if (audioFile) {
        data.append('audioFile', audioFile);
      }
      if (coverFile) {
        data.append('coverFile', coverFile);
      }

      await axios.post(`${API_BASE_URL}/songs`, data);
      
      fetchSongs();
      setFormData({ title: '', artist: '', album: '', genre: 'pop', mood: 'chill', duration: 180, emoji: '🎵', audioUrl: '' });
      setAudioFile(null);
      setCoverFile(null);
      document.getElementById('audioFileInput').value = '';
      document.getElementById('coverFileInput').value = '';
      alert('Song added successfully!');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      console.error('Full Error:', err.response?.data);
      alert('Error adding song: ' + serverMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this song?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/songs/${id}`);
      fetchSongs();
    } catch (err) {
      alert('Error deleting song');
    }
  };

  const seedDatabase = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/songs/seed`);
      alert(res.data.message);
      fetchSongs();
    } catch (err) {
      alert('Error seeding db');
    }
  };

  if (loading) return <div className="view active" style={{ padding: 40 }}>Loading...</div>;

  return (
    <div className="view active" style={{ overflowY: 'auto' }}>
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Control Panel</h1>
        {songs.length === 0 && (
          <button className="btn-primary" onClick={seedDatabase}>Seed Default Songs</button>
        )}
      </div>

      <section className="section" style={{ background: 'var(--surface-50)', padding: 20, borderRadius: 12 }}>
        <h2>Add New Song</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <input name="title" placeholder="Song Title" value={formData.title} onChange={handleChange} required style={inputStyle} />
          <input name="artist" placeholder="Artist Name" value={formData.artist} onChange={handleChange} required style={inputStyle} />
          <input name="album" placeholder="Album (Optional)" value={formData.album} onChange={handleChange} style={inputStyle} />
          <div style={inputStyle}>
            <label style={{ fontSize: 13, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>Upload MP3 File (Optional)</label>
            <input type="file" id="audioFileInput" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
          </div>
          <div style={inputStyle}>
            <label style={{ fontSize: 13, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>Upload Cover Art (Optional)</label>
            <input type="file" id="coverFileInput" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="number" name="duration" placeholder="Duration (seconds)" value={formData.duration} onChange={handleChange} required style={inputStyle} />
            <input name="emoji" placeholder="Emoji" value={formData.emoji} onChange={handleChange} style={{ ...inputStyle, width: 80 }} />
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <select name="genre" value={formData.genre} onChange={handleChange} style={inputStyle}>
              <option value="pop">Pop</option>
              <option value="tamil">Tamil</option>
              <option value="chill">Chill</option>
              <option value="rock">Rock</option>
            </select>
            <select name="mood" value={formData.mood} onChange={handleChange} style={inputStyle}>
              <option value="happy">Happy</option>
              <option value="chill">Chill</option>
              <option value="sad">Sad</option>
              <option value="energy">Energy</option>
              <option value="romantic">Romantic</option>
            </select>
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" disabled={uploading} className="create-playlist-btn" style={{ background: 'var(--accent)', color: '#000', border: 'none', width: '200px', opacity: uploading ? 0.7 : 1 }}>
              {uploading ? 'Uploading...' : 'Add to Database'}
            </button>
          </div>
        </form>
      </section>

      <section className="section" style={{ marginTop: 40 }}>
        <h2>Database Songs ({songs.length})</h2>
        <div className="song-list" style={{ marginTop: 16 }}>
          {songs.map((song, i) => (
            <div key={song._id} className="song-row" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="song-num">{i + 1}</div>
              <div className="song-info">
                <div className="song-thumb">
                  <div className="song-thumb-art" style={{ background: `linear-gradient(135deg,${genGradient(song.emoji)},${genGradient(song.emoji)}aa)` }}>
                    {song.emoji}
                  </div>
                </div>
                <div className="song-info-text">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
              </div>
              <div style={{ marginLeft: 'auto', marginRight: 20 }}>
                {song.audioUrl ? '🔊 Has Audio' : '🔇 No Audio Url'}
              </div>
              <button 
                onClick={() => handleDelete(song._id)}
                style={{ background: '#ff4c4c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  background: 'var(--surface-100)',
  border: '1px solid var(--surface-200)',
  color: 'white',
  padding: '10px 14px',
  borderRadius: 6,
  width: '100%',
  outline: 'none'
};
