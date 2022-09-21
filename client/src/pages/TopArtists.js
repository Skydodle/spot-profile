import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtists } from '../spotify';
import { ArtistsGrid, SectionWrapper } from '../components';

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
      <ul>
        <li>
          <button
            className={activeRange === 'short' ? 'active' : ''}
            onClick={() => setActiveRange('short')}
          >
            This Month
          </button>
        </li>
        <li>
          <button
            className={activeRange === 'medium' ? 'active' : ''}
            onClick={() => setActiveRange('medium')}
          >
            Last 6 Months
          </button>
        </li>
        <li>
          <button
            className={activeRange === 'long' ? 'active' : ''}
            onClick={() => setActiveRange('long')}
          >
            All time
          </button>
        </li>
      </ul>
      {topArtists && (
        <SectionWrapper title="Top Artists" breadcrumb="true">
          <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
        </SectionWrapper>
      )}
    </main>
  );
};
export default TopArtists;
