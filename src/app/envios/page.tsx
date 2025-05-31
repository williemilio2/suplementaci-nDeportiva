import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function EnviosEntregasPage() {
  return (
    <div className={styles.pageContainer}>
            <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Envíos y Entregas</h1>
        <p className={styles.pageSubtitle}>
          Información sobre nuestros métodos de envío, plazos de entrega y costes asociados.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Métodos de Envío</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Envío Estándar</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Entrega en 3-5 días laborables</li>
                <li className={styles.infoListItem}>Coste: 4.95€</li>
                <li className={styles.infoListItem}>Gratis en pedidos superiores a 50€</li>
                <li className={styles.infoListItem}>Seguimiento online disponible</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Envío Express</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Entrega en 24-48 horas (días laborables)</li>
                <li className={styles.infoListItem}>Coste: 7.95€</li>
                <li className={styles.infoListItem}>Disponible para toda la península</li>
                <li className={styles.infoListItem}>Seguimiento online en tiempo real</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Envío a Islas</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoListItem}>Entrega en 4-7 días laborables</li>
                <li className={styles.infoListItem}>Coste: 9.95€</li>
                <li className={styles.infoListItem}>Gratis en pedidos superiores a 80€</li>
                <li className={styles.infoListItem}>Seguimiento online disponible</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Plazos de Entrega</h2>
          <p>
            Los plazos de entrega se calculan en días laborables (de lunes a viernes, excluyendo festivos nacionales y
            locales). El plazo comienza a contar desde la confirmación del pedido y la verificación del pago.
          </p>
          <p>
            Los pedidos realizados antes de las 13:00h serán procesados el mismo día (días laborables). Los pedidos
            realizados después de las 13:00h o en días no laborables serán procesados el siguiente día laborable.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Seguimiento de Pedidos</h2>
          <p>
            Una vez que tu pedido haya sido enviado, recibirás un email con el número de seguimiento y las instrucciones
            para rastrear tu paquete. También podrás consultar el estado de tu pedido en tu cuenta de usuario, en la
            sección &quot;Mis Pedidos&quot;.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Política de Envío Gratuito</h2>
          <p>
            Ofrecemos envío gratuito en pedidos superiores a 50€ para envíos estándar en península. Para envíos a Islas
            Baleares y Canarias, el envío gratuito se aplica en pedidos superiores a 80€.
          </p>
          <p>Esta promoción no es acumulable con otras ofertas o descuentos relacionados con gastos de envío.</p>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>¿Necesitas más información?</h3>
          <p className={styles.contactText}>
            Si tienes alguna pregunta sobre nuestros envíos o entregas, no dudes en contactar con nuestro equipo de
            atención al cliente.
          </p>
          <p className={styles.contactText}>
            Email:{" "}
            <a href="mailto:contacto@suplementaciondeportiva.es" className={styles.contactLink}>
              contacto@suplementaciondeportiva.es
            </a>
          </p>
          <p className={styles.contactText}>
            Teléfono:{" "}
            <a href="tel:+34673385301" className={styles.contactLink}>
              673 385 301
            </a>{" "}
            (Lunes a Viernes, 9:00 - 18:00)
          </p>
        </div>
      </div>
    </div>
  )
}
