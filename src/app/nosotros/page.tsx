import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function QuienesSomosPage() {
  return (
    <div className={styles.pageContainer}>
      <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quiénes Somos</h1>
        <p className={styles.pageSubtitle}>
          Conoce la historia, misión y valores de nuestro equipo. Trabajamos cada día para ofrecerte lo mejor.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
          <p>
            Nacimos con la idea de hacer llegar productos de alta calidad para el bienestar, la nutrición y el rendimiento
            a todas las personas que buscan mejorar su estilo de vida. Desde nuestros inicios, hemos apostado por la
            transparencia, la confianza y un servicio excepcional.
          </p>
          <p>
            Hoy somos una comunidad en crecimiento con miles de clientes satisfechos que nos motivan a seguir mejorando.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestra Misión</h2>
          <p>
            Queremos ayudarte a alcanzar tus metas personales y deportivas ofreciéndote productos cuidadosamente
            seleccionados, con ingredientes de calidad, precios justos y un servicio de atención al cliente cercano y
            eficiente.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Compromiso</h3>
              <p>Estamos comprometidos con tu bienestar. Escuchamos, respondemos y mejoramos cada día para ti.</p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Calidad</h3>
              <p>Trabajamos con proveedores de confianza y seleccionamos productos que cumplen con los más altos estándares.</p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Transparencia</h3>
              <p>Creemos en la honestidad y en darte toda la información que necesitas para tomar decisiones informadas.</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
          <p>
            Somos un equipo joven, dinámico y multidisciplinar, apasionado por la salud, el deporte y la tecnología. Cada
            miembro aporta su talento para que tu experiencia de compra sea excelente.
          </p>
        </div>
      </div>
    </div>
  )
}
