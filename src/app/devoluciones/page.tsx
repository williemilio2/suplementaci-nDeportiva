import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function DevolucionesPage() {
  return (
    <div className={styles.pageContainer}>
        <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Política de Devoluciones</h1>
        <p className={styles.pageSubtitle}>Información sobre cómo realizar devoluciones, plazos y condiciones.</p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Plazo de Devolución</h2>
          <p>
            Dispondrás de 30 días naturales desde la recepción del pedido para solicitar una devolución. Este plazo se
            amplía a 60 días para clientes registrados en nuestro programa de fidelidad.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Condiciones para la Devolución</h2>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              El producto debe estar en perfecto estado, sin abrir y con todos sus precintos originales intactos.
            </li>
            <li className={styles.infoListItem}>
              Debe incluirse el embalaje original completo, accesorios, manuales y cualquier regalo promocional
              recibido.
            </li>
            <li className={styles.infoListItem}>
              Es necesario conservar el ticket o factura de compra, que deberá adjuntarse con la devolución.
            </li>
            <li className={styles.infoListItem}>
              Los productos personalizados o con descuentos especiales pueden tener condiciones de devolución
              diferentes.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cómo Realizar una Devolución</h2>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Proceso de Devolución</h3>
            <ol className={styles.infoList}>
              <li className={styles.infoListItem}>Accede a tu cuenta y ve a la sección Mis Pedidos.</li>
              <li className={styles.infoListItem}>
                Selecciona el pedido que deseas devolver y haz clic en Solicitar Devolución.
              </li>
              <li className={styles.infoListItem}>
                Selecciona los productos que quieres devolver e indica el motivo de la devolución.
              </li>
              <li className={styles.infoListItem}>
                Elige el método de devolución: recogida a domicilio o entrega en punto de recogida.
              </li>
              <li className={styles.infoListItem}>Imprime la etiqueta de devolución y adjúntala al paquete.</li>
              <li className={styles.infoListItem}>
                Prepara el paquete asegurándote de que los productos están en perfecto estado y con su embalaje
                original.
              </li>
              <li className={styles.infoListItem}>
                Entrega el paquete al transportista o llévalo al punto de recogida seleccionado.
              </li>
            </ol>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reembolso</h2>
          <p>
            Una vez recibida y verificada la devolución, procederemos al reembolso en un plazo máximo de 14 días
            naturales. El reembolso se realizará utilizando el mismo método de pago que utilizaste para la compra.
          </p>
          <p>
            Los gastos de envío originales no se reembolsan, excepto en caso de error por nuestra parte o producto
            defectuoso.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Productos Defectuosos</h2>
          <p>
            Si recibes un producto defectuoso o dañado, por favor contacta con nuestro servicio de atención al cliente
            en un plazo de 48 horas desde la recepción. Te proporcionaremos instrucciones específicas para este tipo de
            devoluciones.
          </p>
          <p>
            En estos casos, nos haremos cargo de los gastos de envío y te ofreceremos la opción de reemplazo o reembolso
            completo, incluyendo los gastos de envío originales.
          </p>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>¿Necesitas ayuda con tu devolución?</h3>
          <p className={styles.contactText}>
            Si tienes alguna pregunta o necesitas asistencia con tu devolución, no dudes en contactar con nuestro equipo
            de atención al cliente.
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
