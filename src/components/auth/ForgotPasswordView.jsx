import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { notify } = useUI();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    notify(`Reset link sent to ${email}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        {!submitted ? (
          <>
            <p>Enter your email to receive a password reset link</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. imran@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-btn">Send Reset Link</button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✉️</div>
            <p>Check your inbox for a link to reset your password. If you don't see it, check your spam folder.</p>
            <button className="auth-btn" onClick={() => navigate('/login')}>Back to Log In</button>
          </div>
        )}

        {!submitted && (
          <div className="auth-footer">
            Remember your password? 
            <span className="auth-link" onClick={() => navigate('/login')}>Log In</span>
          </div>
        )}
      </div>
    </div>
  );
}
