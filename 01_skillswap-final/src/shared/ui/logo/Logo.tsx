import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Logo.module.scss';
import starIcon from '../../assets/Star 6.png';

const Logo: React.FC = () => {
  return (
    <NavLink to='/' className={styles.logo}>
      <div className={styles.logopic}>
        <img
          src={starIcon}
          alt='Логотип'
          className={styles.logoicon}
          loading='lazy'
          decoding='async'
        />
      </div>
      <p className={styles.logotext}>SkillSwap</p>
    </NavLink>
  );
};

export default Logo;
