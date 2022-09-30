import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { catchErrors } from '../utils';
import { getPlaylistById, getAudioFeaturesForTracks } from '../spotify';
import { StyledHeader } from '../styles';
import { TrackList, SectionWrapper, Loader } from '../components';
import axios from 'axios';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylistById(id);
      setPlaylist(data);
      setTracksData(data.tracks);
    };
    catchErrors(fetchData());
  }, [id]);

  // console.log(playlist);

  // When tracksData updates, compile arrays of track and audioFeatures
  useEffect(() => {
    if (!tracksData) {
      return;
    }

    // When tracksData updates, check if there are more tracks to fetch
    // then update the state variable
    const fetchMoreData = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    };
    setTracks((tracks) => [...(tracks ? tracks : []), ...tracksData.items]);
    catchErrors(fetchMoreData());

    // Also update the audioFeatures state variable using the track IDs
    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({ track }) => track.id).join(',');
      const { data } = await getAudioFeaturesForTracks(ids);
      setAudioFeatures((audioFeatures) => [
        ...(audioFeatures ? audioFeatures : []),
        ...data['audio_features'],
      ]);
    };
    catchErrors(fetchAudioFeatures());
  }, [tracksData]);

  // Map over tracks and add audio_features property to each track
  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return null;
    }

    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd['audio_features'] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  // // Create a memoized array of tracks for the nested track
  // const tracksForTracklist = useMemo(() => {
  //   if (!tracks) {
  //     return;
  //   }
  //   return tracks.map(({ track }) => track);
  // }, [tracks]);

  return (
    <>
      {playlist && (
        <>
          <StyledHeader>
            <div className="header__inner">
              {playlist.images.length && playlist.images[0].url && (
                <img
                  className="header__img"
                  src={playlist.images[0].url}
                  alt="Playlist Artwork"
                />
              )}
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  {playlist.followers.total ? (
                    <span>
                      {playlist.followers.total}{' '}
                      {`follower${playlist.followers.total !== 1 ? 's' : ''}`}
                    </span>
                  ) : null}
                  <span>
                    {playlist.tracks.total}{' '}
                    {`song${playlist.tracks.total !== 1 ? 's' : ''}`}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            <SectionWrapper title="Playlist tracks" breadcrumb="true">
              {playlist && tracksForTracklist ? (
                <TrackList tracks={tracksForTracklist} />
              ) : (
                <Loader />
              )}
            </SectionWrapper>
          </main>
        </>
      )}
    </>
  );
};

export default Playlist;
