import { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';

export default function ProfileView() {
  const { user, updateProfile } = useUI();
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setGender(user.gender || null);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile({ username, gender });
    setLoading(false);
  };

  if (!user) return null;

  const firstLetter = user.username?.charAt(0).toLowerCase() || 'a';
  const gradientClass = `avatar-gradient-${firstLetter.match(/[a-z]/) ? firstLetter : 'a'}`;

  return (
    <div className="profile-view">
      <div className="profile-header-large">
        <div className={`avatar-large ${gradientClass}`}>
          {user.username?.charAt(0)}
        </div>
        <h1 style={{ marginBottom: '8px' }}>{user.username}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div>
          <h3 className="profile-section-title">Public Profile</h3>
          <div className="capsule-input-wrap">
            <input 
              type="text" 
              className="capsule-input" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <h3 className="profile-section-title">Gender & Identity</h3>
          <div className="gender-select">
            {['Male', 'Female', 'Other'].map(opt => (
              <button
                key={opt}
                type="button"
                className={`gender-chip ${gender === opt ? 'active' : ''}`}
                onClick={() => setGender(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button type="submit" className="pill-button" disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Your dynamic profile color is based on your first initial. <br/>
          Change your username to discover a different color theme!
        </p>
      </div>
    </div>
  );
}
