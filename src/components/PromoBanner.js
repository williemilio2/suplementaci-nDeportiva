import styles from '../styles/PromoBanner.module.css';

export default function PromoBanner() {
  return (
    <div className={styles.promoBanner}>
      <p className={styles.promoText}>
        ¡Inauguracion! <span className={styles.highlight}>Hasta 30% DTO</span> en Proteínas{" "}
      </p>
    </div>
  );
}