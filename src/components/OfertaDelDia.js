'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import styles from '../styles/ofertaDelDia.module.css';
import OfferProductCard from "./ContenedorPorducto";
import { productosSuperOfertas }  from '../others/listaArchivos'

export default function DailyOffer() {
  const [time, setTime] = useState({ h: '--', m: '--', s: '--' });
  const [offsetFromUTC, setOffsetFromUTC] = useState(null);
  // Obtener la fecha actual en formato español
  const getCurrentDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('es-ES', options);
  };

  useEffect(() => {
    const localOffset = new Date().getTimezoneOffset() * -60000; // offset local en ms
    setOffsetFromUTC(localOffset);
  }, []);

  useEffect(() => {
    if (offsetFromUTC === null) return;

    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
  
      const diff = tomorrow - now;
      const totalSecondsLeft = Math.floor(diff / 1000);
  
      const h = Math.floor(totalSecondsLeft / 3600);
      const m = Math.floor((totalSecondsLeft % 3600) / 60);
      const s = totalSecondsLeft % 60;
  
      setTime({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
  
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [offsetFromUTC]);

  return (
    <section className={styles.dailyOfferSection}>
      <div className="container">
        {/* Encabezado de la sección */}
        <div className={styles.offerHeader}>
          <div className={styles.offerTitleContainer}>
            <h2 className={styles.offerTitle}>¡OFERTA DEL DÍA!</h2>
            <p className={styles.offerDate}>{getCurrentDate()}</p>
          </div>
          
          <div className={styles.countdownContainer}>
            <div className={styles.countdownLabel}>
              <Clock size={18} />
              <span>Termina en:</span>
            </div>
            <div className={styles.countdown}>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>{time.h}</span>
                <span className={styles.timeLabel}>horas</span>
              </div>
              <span className={styles.timeSeparator}>:</span>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>{time.m}</span>
                <span className={styles.timeLabel}>min</span>
              </div>
              <span className={styles.timeSeparator}>:</span>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>{time.s}</span>
                <span className={styles.timeLabel}>seg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Productos en oferta */}
        <div className={styles.offerProducts}>
          {productosSuperOfertas.slice(0, 3).map(product => (
            <OfferProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Botón para ver todas las ofertas */}
        <div className={styles.viewAllContainer}>
          <Link href="/ofertas" className={styles.viewAllButton}>
            <span>Ver las demás ofertas</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}