import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

export default function TopBar() {
  const { user, logout, theme, toggleTheme, themeColor, setThemeColor, eyeCare, toggleEyeCare } = useUI();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const firstLetter = user.username?.charAt(0).toLowerCase() || 'a';
  const gradientClass = `avatar-gradient-${firstLetter.match(/[a-z]/) ? firstLetter : 'a'}`;

  return (
    <div className="top-bar">
      <div className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)} ref={dropdownRef}>
        <div className={`avatar-small ${gradientClass}`}>
          {user.username?.charAt(0)}
        </div>
        <span className="username-tag">{user.username}</span>
        
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '4px', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {dropdownOpen && (
          <div className="profile-dropdown">
            <button className="dropdown-item" onClick={() => navigate('/profile')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile Settings
            </button>
            
            <button className="dropdown-item" onClick={() => navigate('/admin')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              Admin Controls
            </button>
            
            <div className="dropdown-divider"></div>
            
            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
              {theme === 'space' ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
              {theme === 'space' ? 'Bright Mode' : 'Space Mode'}
            </button>

            <div className="dropdown-item" onClick={(e) => e.stopPropagation()} style={{ cursor: 'default', display: 'flex', gap: '8px', padding: '12px 14px' }}>
              {[{id: 'purple', hex: '#a78bfa'}, {id: 'sapphire', hex: '#60a5fa'}, {id: 'emerald', hex: '#34d399'}, {id: 'amber', hex: '#fbbf24'}, {id: 'rose', hex: '#fb7185'}].map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setThemeColor(c.hex)}
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: c.hex, cursor: 'pointer',
                    outline: themeColor === c.hex ? `2px solid ${c.hex}` : 'none',
                    outlineOffset: '2px'
                  }}
                  title={`Change accent to ${c.id}`}
                />
              ))}
            </div>

            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); toggleEyeCare(); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Comfort View: {eyeCare ? 'On' : 'Off'}
            </button>

            <div className="dropdown-divider"></div>

            <button className="dropdown-item" onClick={() => logout()} style={{ color: '#ff6b6b' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
