import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

export default function MagicVerifyView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicLink } = useUI();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'error'

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyMagicLink(token).then(success => {
        if (success) {
          navigate('/');
        } else {
          setStatus('error');
        }
      });
    } else {
      setStatus('error');
    }
  }, [searchParams, verifyMagicLink, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' ? (
          <>
            <div className="loading-spinner" style={{ margin: '0 auto 24px' }}></div>
            <h2>Verifying Link</h2>
            <p>Just a moment, we're diving into your music library...</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h2>Invalid Link</h2>
            <p>This magic link is invalid or has expired. Please request a new one.</p>
            <button className="auth-btn" onClick={() => navigate('/login')}>Back to Log In</button>
          </>
        )}
      </div>
    </div>
  );
}
