import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { UIProvider } from './context/UIContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import PlaylistModal from './components/PlaylistModal';
import Notification from './components/Notification';
import NowPlayingModal from './components/NowPlayingModal';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import LibraryView from './components/views/LibraryView';
import ArtistsView from './components/views/ArtistsView';
import ArtistProfileView from './components/views/ArtistProfileView';
import AlbumView from './components/views/AlbumView';
import PlaylistView from './components/views/PlaylistView';
import AIView from './components/views/AIView';
import TopBar from './components/TopBar';
import ProfileView from './components/views/ProfileView';
import AdminPage from './pages/AdminPage';
import ThemeBackground from './components/shared/ThemeBackground';
import ComfortOverlay from './components/shared/ComfortOverlay';
import LoginView from './components/auth/LoginView';
import SignUpView from './components/auth/SignUpView';
import MagicVerifyView from './components/auth/MagicVerifyView';
import { useUI } from './context/UIContext';

function AppContent() {
  const { togglePlay, jumpTime, setVolume } = usePlayer();
  const { isAuthenticated } = useUI();

  // Keyboard shortcuts
  useEffect(() => {
    if (!isAuthenticated) return;
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.code) {
        case 'Space': 
          e.preventDefault(); 
          togglePlay(); 
          break;
        case 'ArrowRight':
          e.preventDefault();
          jumpTime(5); // +5 seconds
          break;
        case 'ArrowLeft':
          e.preventDefault();
          jumpTime(-5); // -5 seconds
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(100, prev + 10)); // +10% volume
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 10)); // -10% volume
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [togglePlay, jumpTime, setVolume, isAuthenticated]);

  return (
    <>
      <ThemeBackground />
      <ComfortOverlay />
      
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignUpView />} />
          <Route path="/verify" element={<MagicVerifyView />} />
          <Route path="*" element={<LoginView />} />
        </Routes>
      ) : (
        <>
          <Sidebar />
          <main className="main-content" id="mainContent">
            <TopBar />
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/search" element={<SearchView />} />
              <Route path="/library" element={<LibraryView />} />
              <Route path="/artists" element={<ArtistsView />} />
              <Route path="/ai" element={<AIView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/album/:id" element={<AlbumView />} />
              <Route path="/artist/:id" element={<ArtistProfileView />} />
              <Route path="/playlist/:id" element={<PlaylistView />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomeView />} />
            </Routes>
          </main>
          <PlayerBar />
          <PlaylistModal />
          <NowPlayingModal />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <UIProvider>
      <PlayerProvider>
        <AppContent />
        <Notification />
      </PlayerProvider>
    </UIProvider>
  );
}
