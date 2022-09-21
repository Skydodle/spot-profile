import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { catchErrors } from '../utils';
import { getPlaylistById } from '../spotify';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentPlaylistData = await getPlaylistById(id);
      setPlaylist(currentPlaylistData.data);

      console.log(currentPlaylistData.data);
    };
    catchErrors(fetchData());
  }, [id]);

  return (
    <main>
      <h1>Individual Playlist Page</h1>
    </main>
  );
};
export default Playlist;
