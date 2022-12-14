import { useState, useEffect } from 'react';
import { TrackList, SectionWrapper, TimeRangeButtons } from '../components';
import { catchErrors } from '../utils';
import { getTopTracks } from '../spotify';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const userTopTracks = await getTopTracks(`${activeRange}_term`);
      setTopTracks(userTopTracks.data);

      // console.log(userTopTracks.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      {topTracks && (
        <SectionWrapper title="Top tracks" breadcrumb="true">
          <TimeRangeButtons
            activeRange={activeRange}
            setActiveRange={setActiveRange}
          />
          <TrackList tracks={topTracks.items} />
        </SectionWrapper>
      )}
    </main>
  );
};

export default TopTracks;
