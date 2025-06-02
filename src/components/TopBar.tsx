'use client';

import Link from 'next/link';
import styles from '../styles/TopBar.module.css';
import { LogIn, UserPlus, BicepsFlexed, LogOut } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    fetch('/api/verifyToken', {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setUserName(null);
    router.push('/auth/login');
  };

  return (
    <div className={styles.topBar}>
      <div>Envío gratuito a partir de 34,99€*</div>
      <div className={styles.topBarRight}>
        <div className={styles.authLinks}>
          {userName ? (
            <div
              className={`${styles.linksDiv} ${styles.userDropdownTrigger} hoverable`}
              onClick={() => setDropdownOpen(prev => !prev)}
              ref={dropdownRef}
            >
              Hola, {userName}
              <BicepsFlexed size={18} style={{ marginLeft: '5px' }} />
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div onClick={handleLogout} className={styles.dropdownItem}>
                    <LogOut size={16} style={{ marginRight: '6px' }} />
                    Cerrar sesión
                  </div>
                </div>
              )}
            </div>
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
