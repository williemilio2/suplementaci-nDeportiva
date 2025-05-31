import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ProgramaAfiliadosPage() {
  return (
    <div className={styles.pageContainer}>
      <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>El Club Elite</h1>
        <p className={styles.pageSubtitle}>
          Únete a nuestro programa de fidelización y empieza a disfrutar de beneficios exclusivos desde tu primera compra.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Qué es el Club Elite?</h2>
          <p>
            El Club Elite es nuestro programa de afiliados premium diseñado para agradecer a nuestros clientes más fieles. 
            Al crear una cuenta e iniciar sesión, accedes automáticamente a este plan. Con solo realizar tu primera compra, 
            desbloqueas todas las ventajas exclusivas del Club Elite.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Beneficios iniciales</h2>
          <p>
            Desde el primer momento que te registras, formas parte de nuestro Club. Antes de tu primera compra, ya puedes disfrutar de:
          </p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>Descuentos en envíos: recibe tus productos a menor coste.</li>
            <li className={styles.infoListItem}>Ofertas exclusivas: hasta un 15% adicional en nuestros productos.</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Una vez compras, entras al Club Elite</h2>
          <p>
            Al realizar tu primera compra, se desbloquean automáticamente los beneficios completos del Club Elite:
          </p>

          <div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Acceso VIP</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Prioridad en promociones y lanzamientos</li>
                <li className={styles.infoListItem}>Acceso anticipado a productos exclusivos</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Regalos para miembros</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Productos exclusivos solo para miembros del Club</li>
                <li className={styles.infoListItem}>Sorpresas especiales según tu historial de compras</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>¿Cómo empiezo?</h2>
          <p>
            1. Crea una cuenta gratuita en nuestra web.<br />
            2. Inicia sesión y empieza a navegar con beneficios iniciales.<br />
            3. Realiza tu primera compra y accede al Club Elite automáticamente.
          </p>
        </div>
      </div>
    </div>
  )
}
