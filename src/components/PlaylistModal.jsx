import { usePlayer } from '../context/PlayerContext';
import { useUI } from '../context/UIContext';

export default function PlaylistModal() {
  const { playlists, addSongToPlaylist, createPlaylistFromModal } = usePlayer();
  const { playlistModalOpen, closeModal, pendingPlaylistSong } = useUI();

  return (
    <div
      className={`modal-overlay ${playlistModalOpen ? 'open' : ''}`}
      onClick={closeModal}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add to Playlist</h3>
        <div>
          {Array.isArray(playlists) && playlists.length > 0 ? (
            playlists.map(p => (
              <div
                key={p.id}
                className="modal-playlist-item"
                onClick={() => addSongToPlaylist(p.id, pendingPlaylistSong)}
              >
                <div className="playlist-dot"></div>
                <span>{p.name}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12 }}>
                  {(p.songs?.length || 0)} songs
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>
              No playlists yet. Create one!
            </p>
          )}
        </div>
        <button className="modal-create-btn" onClick={() => createPlaylistFromModal(pendingPlaylistSong)}>
          + Create New Playlist
        </button>
        <button className="modal-close" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}
