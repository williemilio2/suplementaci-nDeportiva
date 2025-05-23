import Link from 'next/link';
import styles from '../styles/TopBar.module.css';
import { LogIn, UserPlus } from 'lucide-react';

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div>Envío gratuito a partir de 29,99€*</div>
      <div className={styles.topBarRight}>
        <div className={styles.authLinks}>
          <Link href="/auth/login" className={`${styles.linksDiv} hoverable`}>
            <LogIn size={24} style={{marginRight: '8px'}}/>
            Iniciar Sesión
          </Link>
          <Link href="/auth/register" className={`${styles.linksDiv} hoverable`}>            
            <UserPlus size={24} style={{margin: '0px 8px'}}/>
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}