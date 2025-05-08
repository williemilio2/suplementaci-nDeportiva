import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Heart  } from 'lucide-react';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="HSN Logo"
            width={120}
            height={50}
          />
        </Link>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por: Producto, Objetivo, Ingrediente..."
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <Search size={20} />
        </button>
      </div>

      <div className={styles.headerRight}>
        <Link href="/deseados" className={styles.cartButton}>
          <div className={styles.cartIcon} style={{backgroundColor: 'red'}}>
            <Heart size={20} />
          </div>
          <span className={styles.cartCount} style={{backgroundColor: '#DC143C !IMPORTANT'}}>0</span>
        </Link>
        <Link href="/cart" className={styles.cartButton}>
          <div className={styles.cartIcon}>
            <ShoppingBag size={20} />
          </div>
          <span className={styles.cartCount}>0</span>
        </Link>
      </div>
    </header>
  );
}