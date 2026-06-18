import { useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ARTISTS as STATIC_ARTISTS } from '../../data/constants';
import ArtistCard from '../shared/ArtistCard';

export default function ArtistsView() {
  const { allSongs } = usePlayer();

  const artists = useMemo(() => {
    const list = [...STATIC_ARTISTS];
    const songsArr = Array.isArray(allSongs) ? allSongs : [];
    
    const normalizeName = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '').trim() : '';

    songsArr.forEach(song => {
      if (!song || !song.artist) return;
      const normSongArtist = normalizeName(song.artist);
      if (!normSongArtist) return;

      // Check if this artist is already in our list (either by name match or static list match)
      const exists = list.some(a => normalizeName(a.name) === normSongArtist);
      if (!exists) {
        // Create a new dynamic artist object
        let emoji = '🎙️';
        if (song.genre === 'tamil') emoji = '🌺';
        else if (song.genre === 'chill') emoji = '☕';
        else if (song.genre === 'hindi') emoji = '🧡';
        else if (song.genre === 'malayalam') emoji = '🌴';

        list.push({
          id: `dyn_art_${normSongArtist}`,
          name: song.artist,
          genre: song.genre ? song.genre.toUpperCase() : 'Artist',
          emoji: emoji,
          songs: []
        });
      }
    });

    return list;
  }, [allSongs]);

  return (
    <div className="view active" id="view-artists">
      <div className="view-header">
        <h1>Artists</h1>
      </div>
      <div className="artist-grid">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
