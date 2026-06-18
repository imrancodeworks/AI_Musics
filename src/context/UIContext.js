import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import axios from 'axios';
import API_BASE_URL from '../config';

const UIContext = createContext();

export function useUI() {
  return useContext(UIContext);
}

export function UIProvider({ children }) {
  const { message, visible, notify } = useNotification();
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [pendingPlaylistSong, setPendingPlaylistSong] = useState(null);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    let t = localStorage.getItem('app-theme') || 'space';
    if (t === 'dark') t = 'space';
    if (t === 'light') t = 'bright';
    return t;
  });
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('app-color') || '#a78bfa');
  const [eyeCare, setEyeCare] = useState(() => localStorage.getItem('app-eye-care') === 'true');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set axios defaults
  axios.defaults.baseURL = API_BASE_URL;
  const token = localStorage.getItem('auth-token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', themeColor);
    localStorage.setItem('app-color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    document.documentElement.setAttribute('data-eyecare', eyeCare);
    localStorage.setItem('app-eye-care', eyeCare);
  }, [eyeCare]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('auth-token');
      if (storedToken) {
        try {
          const res = await axios.get('/user');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('auth-token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    };
    loadUser();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'space' || prev === 'dark' ? 'bright' : 'space'));
  }, []);

  const toggleEyeCare = useCallback(() => {
    setEyeCare(prev => !prev);
  }, []);

  const signup = async (email, username, password) => {
    try {
      const res = await axios.post('/user/signup', { email, username, password });
      localStorage.setItem('auth-token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      setIsAuthenticated(true);
      notify(`Welcome to A&I Music, ${username}!`);
      return true;
    } catch (err) {
      notify(err.response?.data?.message || 'Error creating account');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/user/login', { email, password });
      localStorage.setItem('auth-token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      setIsAuthenticated(true);
      notify(`Welcome back, ${res.data.user.username}!`);
      return true;
    } catch (err) {
      notify(err.response?.data?.message || 'Invalid email or password');
      return false;
    }
  };

  const requestMagicLink = async (email) => {
    try {
      const res = await axios.post('/user/magic-link', { email });
      notify(res.data.message);
      return true;
    } catch (err) {
      notify(err.response?.data?.message || 'Error sending link');
      return false;
    }
  };

  const verifyMagicLink = async (token) => {
    try {
      const res = await axios.post('/user/verify-magic', { token });
      localStorage.setItem('auth-token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      setIsAuthenticated(true);
      notify(`Welcome back, ${res.data.user.username}!`);
      return true;
    } catch (err) {
      notify(err.response?.data?.message || 'Link invalid or expired');
      return false;
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put('/user/profile', data);
      setUser(prev => ({ ...prev, ...res.data.user }));
      notify(res.data.message);
      return true;
    } catch (err) {
      notify(err.response?.data?.message || 'Error updating profile');
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth-token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    notify('Logged out successfully');
  }, [notify]);

  const openAddToPlaylist = useCallback((songId) => {
    setPendingPlaylistSong(songId);
    setPlaylistModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setPlaylistModalOpen(false);
    setPendingPlaylistSong(null);
  }, []);

  const toggleNowPlaying = () => {
    setIsNowPlayingOpen(!isNowPlayingOpen);
  };

  const value = {
    message, visible, notify,
    playlistModalOpen, pendingPlaylistSong,
    openAddToPlaylist, closeModal, setPendingPlaylistSong,
    isNowPlayingOpen, toggleNowPlaying,
    theme, toggleTheme, themeColor, setThemeColor,
    eyeCare, toggleEyeCare,
    user, isAuthenticated, logout, signup, login, updateProfile,
    requestMagicLink, verifyMagicLink
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}
