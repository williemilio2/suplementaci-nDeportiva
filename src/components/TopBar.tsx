'use client';

import Link from 'next/link';
import styles from '../styles/TopBar.module.css';
import { LogIn, UserPlus, BicepsFlexed } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // npm i js-cookie

export default function TopBar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    fetch('/api/verifyToken', {  // Crea esta API que valide el token y devuelva el nombre
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.resultado && data.nombre) {
          setUserName(data.nombre);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles.topBar}>
      <div>Envío gratuito a partir de 34,99€*</div>
      <div className={styles.topBarRight}>
        <div className={styles.authLinks}>
          {userName ? (
            <div className={styles.linksDiv}>Hola, {userName} <BicepsFlexed size={18} style={{marginLeft: '5px'}}/></div>
          ) : (
            <>
              <Link href="/auth/login" className={`${styles.linksDiv} hoverable`}>
                <LogIn size={24} style={{ marginRight: '8px' }} />
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className={`${styles.linksDiv} hoverable`}>
                <UserPlus size={24} style={{ margin: '0px 8px' }} />
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
