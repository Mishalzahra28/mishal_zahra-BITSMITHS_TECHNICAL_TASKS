import styles from '../public/styles/header.module.scss';
export default function NavBar() {
  const items = {
    new: '#',
    past: '#',
    comments: '#',
    ask: '#',
    show: '#',
    jobs: '#',
    submit: '#',
  };
  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <h1 className={styles.header}>Hacker News</h1>
        {Object.entries(items).map(([key, value], index) => (
          <div key={index}>
            <a href={value} className={styles.flexItem}>
              {key}
            </a>
            {index < Object.entries(items).length - 1 && (
              <span className={styles.separator}> | </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
