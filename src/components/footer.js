import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/footer.module.css';
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Truck, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Sección superior del footer */}
      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.footerServices}>
            <div className={styles.serviceItem}>
              <Truck className={styles.serviceIcon} />
              <div className={styles.serviceText}>
                <h4>Envío Gratis</h4>
                <p>En pedidos superiores a 29.99€</p>
              </div>
            </div>
            <div className={styles.serviceItem}>
              <CreditCard className={styles.serviceIcon} />
              <div className={styles.serviceText}>
                <h4>Pago Seguro</h4>
                <p>Tarjeta, PayPal, Transferencia</p>
              </div>
            </div>
            <div className={styles.serviceItem}>
              <Phone className={styles.serviceIcon} />
              <div className={styles.serviceText}>
                <h4>Atención al Cliente</h4>
                <p>Lun-Vie: 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal del footer */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerColumns}>
            {/* Columna 1: Sobre nosotros */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>SOBRE POWERFITT</h3>
              <ul className={styles.footerLinks}>
                <li><Link href="/nosotros">Quiénes Somos</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
                <li><Link href="/trabaja-con-nosotros">Trabaja con Nosotros</Link></li>
                <li><Link href="/afiliados">Programa de Afiliados</Link></li>
              </ul>
            </div>

            {/* Columna 2: Ayuda */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>AYUDA</h3>
              <ul className={styles.footerLinks}>
                <li><Link href="/envios">Envíos y Entregas</Link></li>
                <li><Link href="/devoluciones">Devoluciones</Link></li>
                <li><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
                <li><Link href="/metodos-pago">Métodos de Pago</Link></li>
                <li><Link href="/politica-privacidad">Política de Privacidad</Link></li>
                <li><Link href="/terminos-condiciones">Términos y Condiciones</Link></li>
              </ul>
            </div>

            {/* Columna 3: Categorías */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>CATEGORÍAS</h3>
              <ul className={styles.footerLinks}>
                <li><Link href="/proteinas">Proteínas</Link></li>
                <li><Link href="/aminoacidos">Aminoácidos</Link></li>
                <li><Link href="/pre-entreno">Pre-entreno</Link></li>
                <li><Link href="/creatina">Creatina</Link></li>
                <li><Link href="/vitaminas">Vitaminas</Link></li>
                <li><Link href="/control-peso">Control de Peso</Link></li>
              </ul>
            </div>

            {/* Columna 4: Newsletter */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>NEWSLETTER</h3>
              <p className={styles.newsletterText}>Suscríbete y recibe ofertas exclusivas y contenido sobre nutrición deportiva.</p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Tu email" className={styles.newsletterInput} />
                <button type="submit" className={styles.newsletterButton}>SUSCRIBIRSE</button>
              </form>
              <div className={styles.socialLinks}>
                <a href="https://facebook.com" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="https://youtube.com" aria-label="Youtube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className={styles.copyright}>
        <div className={`container ${styles.contenedorCopyright}`}>
            <Image
            alt='LogoFooter'
            src={'/logo.png'}
            width={224}
            height={55}
            >

            </Image>
          <p>© {new Date().getFullYear()} POWERFITT. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}