import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtists } from '../spotify';
import { ArtistsGrid, SectionWrapper, TimeRangeButtons } from '../components';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('medium');

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtists = await getTopArtists(`${activeRange}_term`);
      setTopArtists(userTopArtists.data);

      console.log(userTopArtists.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <TimeRangeButtons
        activeRange={activeRange}
        setActiveRange={setActiveRange}
      />
      {topArtists && (
        <SectionWrapper title="Top Artists" breadcrumb="true">
          <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
        </SectionWrapper>
      )}
    </main>
  );
};
export default TopArtists;
