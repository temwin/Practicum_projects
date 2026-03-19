import styles from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <div className={styles.text}>Загрузка...</div>
    </div>
  );
};

export default Loader;
