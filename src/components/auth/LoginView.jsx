import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, requestMagicLink, notify } = useUI();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      notify('Please enter your email first to receive a recovery link');
      return;
    }
    setLoading(true);
    await requestMagicLink(email);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="capsule-input-wrap">
            <input 
              type="email" 
              className="capsule-input" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <svg className="input-icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot-link-alt" onClick={handleForgotPassword}>
              Forgot password?
            </span>
          </div>

          <button type="submit" className="pill-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-card-footer">
          Don't have an account? 
          <span className="register-link" onClick={() => navigate('/signup')}>Register</span>
        </div>
      </div>
    </div>
  );
}


