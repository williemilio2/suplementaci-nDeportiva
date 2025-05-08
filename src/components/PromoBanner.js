import styles from '../styles/PromoBanner.module.css';

export default function PromoBanner() {
  return (
    <div className={styles.promoBanner}>
      <p className={styles.promoText}>
        ¡Protein Days! <span className={styles.highlight}>Hasta 50% DTO</span> en Proteínas |{" "}
        <span className={styles.highlight}>42% DTO Directo</span> en el resto de la web
      </p>
    </div>
  );
}