'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languages } from '@/app/i18n/settings';
import styles from './styles.module.css';

const SwitchLng = ({ lng }: { lng: string }) => {
  const pathname = usePathname();
  const langRegex = languages.join('|');

  return (
    <div className={styles.languageSwitch}>
      {languages.map((lang, index) => (
        <Link
          href={pathname.replace(new RegExp(`^/(${langRegex})\\b`), `/${lang}`)}
          key={lang}
          className={`${styles.link} ${styles[index === 0 ? 'firstLink' : '']} ${
            styles[index === languages.length - 1 ? 'lastLink' : '']
          } ${styles[lang === lng ? 'activeLng' : '']}`}
        >
          <span className={styles.language}>{lang.toUpperCase()}</span>
        </Link>
      ))}
    </div>
  );
};
export default SwitchLng;
