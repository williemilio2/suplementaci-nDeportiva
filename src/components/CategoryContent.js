import styles from '../styles/CategoryContent.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryContent() {
  const tabs = ["GANE HSN", "NUTRICIÓN DEPORTIVA", "ALIMENTACIÓN SALUDABLE", "SALUD Y BIENESTAR"];
  const images = [{'name': "apartadoSlider1", "link": "/especiales?t=veganas"},{'name': "apartadoSlider2", "link": "enCreacion..."},{'name': "apartadoSlider3", "link": "enCreacion..."}]
  return (
    <div className={styles.categoryContent}>
      <div className={styles.categoryTabs}>
        <div className="container">
          <div className={styles.tabsContainer}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`${styles.tab} ${index === 0 ? styles.tabActive : ""} hoverable`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container">
        <div className={styles.contentGrid}>
          {images.map((item) => (
            <div key={item.name} className={styles.contentItem}>
              <div className={styles.itemPlaceholder}>
              <Link href={item['link']}>
                <Image
                  src={`/${item['name']}.webp`}
                  alt="Protein Days Promotion"
                  fill
                  className={styles.heroImage}
                />
              </Link>
              <div className={styles.overlay}>
                <Link href={item.link}>
                  <button className={`${styles.ctaButton} hoverable`}>Ir ahora</button>
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}