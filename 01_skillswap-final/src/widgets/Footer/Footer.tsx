import React from 'react';
import { Logo } from '../../shared/ui/logo';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const item = [
    [
      { href: '#about', label: 'О проекте' },
      { href: '#allskills', label: 'Все навыки' },
    ],
    [
      { href: '#contacts', label: 'Контакты' },
      { href: '#blog', label: 'Блог' },
    ],
    [
      { href: '#privacy', label: 'Политика конфиденциальности' },
      { href: '#agreement', label: 'Пользовательское соглашение' },
    ],
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.logoSection}>
            <Logo />
          </div>
          <span className={styles.copyright}>SkillSwap - 2026</span>
        </div>

        <nav className={styles.nav} aria-label='Дополнительная навигация'>
          {item.map((column, columnIndex) => (
            <div key={columnIndex} className={styles.linkGroup}>
              <ul className={styles.linkList}>
                {column.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
