'use client'
import { useEffect, useState } from "react";
import Image from 'next/image';
import { ArrowRight } from 'lucide-react'
import styles from '../styles/HeroBanner.module.css';
const images = ["/promo3.webp", "/promo2.webp", "/promo.webp"];
export default function HeroBanner() {

  const [currentIndex, setCurrentIndex] = useState(0);

  function mover(direccion){
    if(direccion == 1){
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); 
    }
    else{
      setCurrentIndex((prevIndex) =>
        (prevIndex - 1 + images.length) % images.length
      );
    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroImageContainer}>
        <div
            className={styles.slider}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
          {images.map((img, i) => (
            <div key={i} className={styles.slide}>
              <Image
                src={img}
                alt={`Slide ${i}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
        <div className={`${styles.flechaRight} hoverable`} >
          <ArrowRight size={30} style={{ transform: "rotate(180deg)", marginLeft: '5px'}} className={styles.heroImage} onClick={() => mover(0)}/>
        </div>
        <div className={`${styles.flechaLeft} hoverable`}>
          <ArrowRight size={30} style={{ marginRight: '5px'}} className={styles.heroImage} onClick={() => mover(1)}/>
        </div>
      </div>
      <div className={styles.pagination}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ""}`}></div>
        ))}
      </div>
    </div>
  );
}