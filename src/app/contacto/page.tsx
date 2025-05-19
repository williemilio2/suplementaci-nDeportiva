import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ContactoPage() {
  return (
    <div className={styles.pageContainer}>
      <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Contacto</h1>
        <p className={styles.pageSubtitle}>
          ¿Tienes preguntas? Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo a través de los siguientes medios.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Atención al Cliente</h2>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Horario de atención</h3>
            <ul className={styles.infoList}>
              <li className={styles.infoListItem}>Lunes a Viernes: 9:00 - 18:00</li>
              <li className={styles.infoListItem}>Sábados y Domingos: Cerrado</li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cómo Contactarnos</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Correo Electrónico</h3>
              <p className={styles.contactText}>
                Puedes escribirnos a:{" "}
                <a href="mailto:contacto@suplementaciondeportiva.es" className={styles.contactLink}>
                  contacto@suplementaciondeportiva.es
                </a>
              </p>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Teléfono</h3>
              <p className={styles.contactText}>
                Llámanos al:{" "}
                <a href="tel:+34900000000" className={styles.contactLink}>
                  900 000 000
                </a>
              </p>
              <p className={styles.contactText}>(Horario laboral de Lunes a Viernes)</p>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Redes Sociales</h3>
              <p className={styles.contactText}>
                También puedes escribirnos a través de nuestras redes sociales.
              </p>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>
                  Instagram:{" "}
                  <a href="https://instagram.com/tutienda" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                    @tutienda
                  </a>
                </li>
                <li className={styles.infoListItem}>
                  Facebook:{" "}
                  <a href="https://facebook.com/tutienda" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                    facebook.com/tutienda
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>¿Necesitas ayuda con tu pedido?</h3>
          <p className={styles.contactText}>
            Accede a tu cuenta para ver el estado de tu pedido en la sección &quot;Mis Pedidos&quot;. Si tienes alguna incidencia,
            no dudes en escribirnos con tu número de pedido.
          </p>
        </div>
      </div>
    </div>
  )
}
