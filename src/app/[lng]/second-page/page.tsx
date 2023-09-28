'use client';
import { useState } from 'react';
import Link from 'next/link';
import { locationNS } from '../../i18n';
import { useTranslation } from '../../i18n/client';
import SwitchLng from '@/components/SwitchLng';
import styles from '../page.module.css';
import stylesSP from './page.module.css';

const SecondPage = ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = useTranslation(lng, locationNS.SECOND_PAGE);

  const [color, setColor] = useState('orange');

  const changeColor = () => {
    const availableColours = ['red', 'green', 'blue', 'orange', 'purple'];
    const newColor = availableColours[Math.floor(Math.random() * availableColours.length)];
    setColor(newColor);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>{t('note')}</p>
      </div>
      <SwitchLng lng={lng} />
      <div className={styles.center}>
        <h1 style={{ color: color }}>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <div className={stylesSP.wrapperButton}>
        <button className={stylesSP.button} onClick={changeColor}>
          {t('action')}
        </button>
      </div>
      <div className={styles.cardsContainer}>
        <Link href={`/${lng}`} className={styles.card}>
          <h2>
            {t('link.title')} <span>-&gt;</span>
          </h2>
          <p>{t('link.description')}</p>
        </Link>
      </div>
    </main>
  );
};

export default SecondPage;

// http://localhost:3000 || http://localhost:3000/es/second-page || http://localhost:3000/en/second-page
