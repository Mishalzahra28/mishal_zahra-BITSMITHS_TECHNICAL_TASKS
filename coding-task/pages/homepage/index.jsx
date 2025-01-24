import { useEffect, useState } from 'react';
import styles from '../../public/styles/homepage.module.scss';
import StoryItem from '../../components/storyItem';
const fetchStoriesData = async (ids) => {
  try {
    const promises = ids.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
      ).then((res) => res.json())
    );
    const storiesData = await Promise.all(promises);
    return storiesData;
  } catch (error) {
    console.error('Error fetching stories data:', error);
  }
};

const fetchStoryIds = async () => {
  try {
    const response = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
    );
    if (!response.ok) {
      throw new Error('Failed to fetch story IDs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching story IDs:', error);
  }
};

export default function HomePage() {
  const [totalIds, setTotalIds] = useState([]);
  const [storyIds, setStoryIds] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStory, setLoadingStory] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  useEffect(() => {
    setLoadingStory(true);
    const getStoryIds = async () => {
      let ids = await fetchStoryIds();
      setTotalIds(ids);
      ids = ids.slice(0, 30);
      const storyData = await fetchStoriesData(ids);
      setStoryIds(ids);
      setStories(storyData);
      setLoadingStory(false);
    };
    getStoryIds();
  }, []);

  const loadMoreStories = async () => {
    setLoading(true);
    const nextOffset = currentOffset + 30;
    const newStoryIds = totalIds.slice(currentOffset, nextOffset);
    const newStoriesData = await fetchStoriesData(newStoryIds);
    setStories((prevStories) => [...prevStories, ...newStoriesData]);
    setCurrentOffset(nextOffset);
    setLoading(false);
  };

  return (
    <div className={styles.homepageContainer}>
      {loadingStory ? (
        <p>loading...</p>
      ) : (
        <>
          {stories.map((story, index) => (
            <StoryItem key={story.id} storyData={story} index={index} />
          ))}

          <button
            onClick={loadMoreStories}
            disabled={loading}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
          >
            {loading ? 'Loading...' : 'More'}
          </button>
        </>
      )}
    </div>
  );
}
