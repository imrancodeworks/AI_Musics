import { useNavigate } from 'react-router-dom';
import { genGradient } from '../../data/constants';

export default function ArtistCard({ artist }) {
  const navigate = useNavigate();

  return (
    <div className="artist-card" onClick={() => navigate(`/artist/${artist.id}`)}>
      <div
        className="artist-avatar"
        style={{ background: `linear-gradient(135deg,${genGradient(artist.emoji)}aa,var(--lavender-100))` }}
      >
        {artist.emoji}
      </div>
      <div className="artist-name">{artist.name}</div>
      <div className="artist-genre">{artist.genre}</div>
    </div>
  );
}
