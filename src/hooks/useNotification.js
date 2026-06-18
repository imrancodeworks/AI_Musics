import { useState, useCallback, useRef } from 'react';

export function useNotification() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const notify = useCallback((msg) => {
    setMessage(msg);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2200);
  }, []);

  return { message, visible, notify };
}
