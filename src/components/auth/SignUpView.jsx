import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

export default function SignUpView() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useUI();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await signup(email, username, password);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        
        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="capsule-input-wrap">
            <input 
              type="text" 
              className="capsule-input" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <svg className="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>

          <div className="capsule-input-wrap">
            <input 
              type="email" 
              className="capsule-input" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <svg className="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>

          <div className="capsule-input-wrap">
            <input 
              type="password" 
              className="capsule-input" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <svg className="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>

          <button type="submit" className="pill-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-card-footer">
          Already have an account? 
          <span className="register-link" onClick={() => navigate('/login')}>Login</span>
        </div>
      </div>
    </div>
  );
}
