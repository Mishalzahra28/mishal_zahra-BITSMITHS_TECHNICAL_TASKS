import styles from '../public/styles/homepage.module.scss';
import NavBar from '../components/header';
import HomePage from './homepage';

export default function Home() {
  return (
    <div className={styles.container}>
      <NavBar />
      <HomePage />
    </div>
  );
}
