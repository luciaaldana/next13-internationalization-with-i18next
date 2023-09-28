import Link from 'next/link';
import { locationNS, useTranslation } from '../i18n';
import SwitchLng from '@/components/SwitchLng';
import styles from './page.module.css';

const Home = async ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = await useTranslation(lng, locationNS.HOME);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>{t('note')}</p>
      </div>
      <SwitchLng lng={lng} />
      <div className={styles.center}>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>

      <div className={styles.cardsContainer}>
        <Link href={`/${lng}/second-page`} className={styles.card}>
          <h2>
            {t('link.title')} <span>-&gt;</span>
          </h2>
          <p> {t('link.description')}</p>
        </Link>
      </div>
    </main>
  );
};

export default Home;

// http://localhost:3000 || http://localhost:3000/es || http://localhost:3000/en
