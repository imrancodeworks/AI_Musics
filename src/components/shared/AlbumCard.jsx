import { useNavigate } from 'react-router-dom';

export default function AlbumCard({ album }) {
  const navigate = useNavigate();

  return (
    <div className="album-card" onClick={() => navigate(`/album/${album.id}`)}>
      <div className="album-cover">
        <div
          className="album-art"
          style={{ background: `linear-gradient(135deg,${album.gradient})`, color: '#fff' }}
        >
          {album.emoji}
          <div className="album-play-overlay">
            <div className="album-play-circle">
              <svg viewBox="0 0 20 20"><path d="M7 4l10 6-10 6z" fill="currentColor" /></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="album-info">
        <div className="album-name">{album.name}</div>
        <div className="album-artist">{album.artist}</div>
      </div>
    </div>
  );
}
