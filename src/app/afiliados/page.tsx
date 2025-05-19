import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ProgramaAfiliadosPage() {
  return (
    <div className={styles.pageContainer}>
      <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Programa de Afiliados</h1>
        <p className={styles.pageSubtitle}>
          Únete a nuestro plan exclusivo y disfruta de ventajas únicas por ser parte de nuestra comunidad.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
          <p>
            Una vez creas tu cuenta e inicias sesión por primera vez, te unes automáticamente a nuestro Programa de
            Afiliados. Este programa está diseñado para recompensar a nuestros clientes más fieles con beneficios
            exclusivos y promociones personalizadas.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Beneficios del Programa</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Descuentos Exclusivos</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Promociones solo para afiliados</li>
                <li className={styles.infoListItem}>Descuentos acumulables</li>
                <li className={styles.infoListItem}>Ofertas personalizadas según tus compras</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Acceso Anticipado</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Lanzamientos de productos antes que nadie</li>
                <li className={styles.infoListItem}>Reservas prioritarias en promociones especiales</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Recompensas por Compartir</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Invita a tus amigos y gana cupones</li>
                <li className={styles.infoListItem}>Bonificaciones por cada compra referida</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Requisitos y Condiciones</h2>
          <p>
            Para mantener tu acceso al Programa de Afiliados, solo necesitas mantener tu cuenta activa. No hay costes
            ocultos ni suscripciones adicionales. Simplemente inicia sesión y comienza a disfrutar de los beneficios.
          </p>
          <p>
            Las recompensas y promociones están sujetas a cambios, pero siempre te notificaremos por correo electrónico
            y dentro de tu perfil de usuario.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Consulta tu Panel de Afiliado</h2>
          <p>
            Desde tu cuenta, accede a la sección “Programa de Afiliados” para ver tu progreso, recompensas activas,
            enlaces de invitación y mucho más.
          </p>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>¿Tienes dudas sobre el programa?</h3>
          <p className={styles.contactText}>
            Si necesitas más información o tienes alguna pregunta, estamos aquí para ayudarte.
          </p>
          <p className={styles.contactText}>
            Email:{" "}
            <a href="mailto:afiliados@tutienda.com" className={styles.contactLink}>
              afiliados@tutienda.com
            </a>
          </p>
          <p className={styles.contactText}>
            Teléfono:{" "}
            <a href="tel:+34900000001" className={styles.contactLink}>
              900 000 001
            </a>{" "}
            (Lunes a Viernes, 9:00 - 18:00)
          </p>
        </div>
      </div>
    </div>
  )
}
