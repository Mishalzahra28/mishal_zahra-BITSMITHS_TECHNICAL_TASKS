import styles from '@/public/styles/storyItem.module.scss';

interface Story {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: 'story';
  url: string;
}

interface StoryItemProps {
  storyData: Story;
  index: number;
}

export default function StoryItem({ storyData, index }: StoryItemProps) {
  const data = storyData;
  const calculateTimeDifference = (timestamp: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = currentTime - timestamp;

    const hours = Math.floor(timeDifference / 3600);
    const minutes = Math.floor((timeDifference % 3600) / 60);

    if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className={styles.storyContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.indexText}>{index + 1}.</p>
        <a className={styles.storyTitle} href={data.url}>
          {data.title}
        </a>
      </div>
      <p className={styles.subtitleText}>
        {data.score} points by {data.by} | {calculateTimeDifference(data.time)}{' '}
        | {data?.kids?.length} comments
      </p>
    </div>
  );
}
