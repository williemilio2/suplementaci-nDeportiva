import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function TerminosCondicionesPage() {
  return (
    <div className={styles.pageContainer}>
            <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Términos y Condiciones</h1>
        <p className={styles.pageSubtitle}>
          Condiciones generales que regulan el uso de nuestra web y la compra de productos.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información General</h2>
          <p>
            Las presentes Condiciones Generales regulan el uso del sitio web <strong>www.suplementaciondeportiva.es</strong> (en
            adelante, suplementacionDeportiva.es), del que es titular Tu Tienda, S.L. (en adelante, `suplementaciondeportiva`).
          </p>
          <p>
            <strong>Datos de la Empresa:</strong>
            <br />
            Tu Tienda, S.L.
            <br />
            CIF: B12345678
            <br />
            Domicilio social: Calle Ejemplo, 123, 28001 Madrid
            <br />
            Inscrita en el Registro Mercantil de Madrid, Tomo XXXX, Folio XXX, Hoja M-XXXXXX
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Aceptación de las Condiciones</h2>
          <p>
            La navegación por el Sitio Web y/o la adquisición de cualquiera de los productos ofrecidos implica la
            aceptación como usuario, sin reservas de ninguna clase, de todas las Condiciones Generales.
          </p>
          <p>
            La Empresa podrá modificar en cualquier momento las Condiciones Generales. Dichas modificaciones entrarán en
            vigor desde su publicación en el Sitio Web. Es responsabilidad del usuario leer las Condiciones Generales
            cada vez que acceda o utilice el Sitio Web.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Proceso de Compra</h2>
          <p>
            Para realizar una compra en nuestro Sitio Web, deberás seguir el procedimiento indicado. La formalización
            del contrato de compraventa se produce en el momento en que recibes la confirmación de pedido.
          </p>
          <p>Nos reservamos el derecho a no procesar pedidos en los siguientes casos:</p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>Cuando los productos no estén disponibles.</li>
            <li className={styles.infoListItem}>
              Cuando la información de pago no pueda ser verificada o sea incorrecta.
            </li>
            <li className={styles.infoListItem}>Cuando existan indicios de que el pedido es fraudulento.</li>
            <li className={styles.infoListItem}>Cuando el pedido no cumpla con estas Condiciones Generales.</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Precios y Formas de Pago</h2>
          <p>
            Los precios de los productos incluyen el IVA aplicable en cada momento, pero no incluyen los gastos de
            envío, que se añadirán al importe total y se mostrarán antes de finalizar el pedido.
          </p>
          <p>
            Aceptamos los siguientes métodos de pago: tarjetas de crédito/débito (Visa, Mastercard, American Express),
            PayPal, transferencia bancaria y pago contra reembolso (con coste adicional).
          </p>
          <p>
            Nos reservamos el derecho a modificar los precios en cualquier momento, pero los productos se facturarán
            según el precio publicado en el momento de formalizar el pedido.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Envío y Entrega</h2>
          <p>
            Los plazos de entrega son orientativos y no constituyen una obligación contractual. No seremos responsables
            por retrasos en la entrega causados por circunstancias ajenas a nuestro control.
          </p>
          <p>
            El riesgo de pérdida o daño de los productos se transferirá al cliente en el momento de la entrega. Es
            responsabilidad del cliente inspeccionar los productos en el momento de la entrega y notificar cualquier
            daño visible.
          </p>
          <p>
            Para más información sobre envíos y entregas, consulta nuestra página de{" "}
            <a href="/envios-entregas" className={styles.contactLink}>
              Envíos y Entregas
            </a>
            .
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Devoluciones y Derecho de Desistimiento</h2>
          <p>
            Tienes derecho a desistir del contrato en un plazo de 14 días naturales sin necesidad de justificación. El
            plazo de desistimiento expirará a los 14 días naturales del día en que tú o un tercero indicado por ti,
            distinto del transportista, adquirió la posesión material de los bienes.
          </p>
          <p>
            Para ejercer el derecho de desistimiento, deberás notificarnos tu decisión mediante una declaración
            inequívoca (por ejemplo, una carta enviada por correo postal o correo electrónico).
          </p>
          <p>
            Para más información sobre devoluciones, consulta nuestra{" "}
            <a href="/devoluciones" className={styles.contactLink}>
              Política de Devoluciones
            </a>
            .
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Garantía de los Productos</h2>
          <p>
            Todos nuestros productos están cubiertos por la garantía legal establecida en el Real Decreto Legislativo
            1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de
            los Consumidores y Usuarios.
          </p>
          <p>
            La garantía cubre los defectos de conformidad que se manifiesten en un plazo de dos años desde la entrega
            del producto. Durante los primeros seis meses se presume que el defecto es de origen, y posteriormente
            corresponderá al consumidor demostrar que el defecto existía en el momento de la entrega.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Propiedad Intelectual e Industrial</h2>
          <p>
            Todos los contenidos del Sitio Web, incluyendo, a título enunciativo pero no limitativo, textos, gráficos,
            imágenes, su diseño y los derechos de propiedad intelectual que pudieran corresponder a dichos contenidos,
            así como las marcas, nombres comerciales o cualquier otro signo distintivo, son propiedad de la Empresa o de
            sus legítimos titulares, estando protegidos por las leyes y tratados internacionales en materia de propiedad
            intelectual e industrial.
          </p>
          <p>
            Queda expresamente prohibida la reproducción total o parcial del Sitio Web, ni siquiera mediante un
            hiperenlace, sin el consentimiento expreso y por escrito de la Empresa.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitación de Responsabilidad</h2>
          <p>
            La Empresa no garantiza la disponibilidad y continuidad del funcionamiento del Sitio Web. No seremos
            responsables por los daños y perjuicios causados al usuario como consecuencia de la indisponibilidad, fallos
            de acceso y falta de continuidad del Sitio Web.
          </p>
          <p>
            La Empresa no será responsable de los contenidos e información de terceros a los que se pueda acceder a
            través de enlaces desde el Sitio Web.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ley Aplicable y Jurisdicción</h2>
          <p>
            Las presentes Condiciones Generales se rigen por la legislación española. Para la resolución de cualquier
            controversia que pudiera surgir en relación con el acceso y/o uso del Sitio Web, la Empresa y el usuario se
            someten a los Juzgados y Tribunales del domicilio del usuario.
          </p>
          <p>
            En caso de que el usuario tenga su domicilio fuera de España, la Empresa y el usuario se someten, con
            renuncia expresa a cualquier otro fuero, a los Juzgados y Tribunales de Madrid (España).
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Resolución de Conflictos</h2>
          <p>
            De conformidad con el Reglamento UE 524/2013, te informamos que tienes derecho a solicitar la resolución
            extrajudicial de controversias en materia de consumo accesible a través de la plataforma de resolución de
            litigios en línea de la Unión Europea accesible en el siguiente enlace:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              className={styles.contactLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .
          </p>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Contacto</h3>
          <p className={styles.contactText}>
            Si tienes alguna pregunta sobre nuestros Términos y Condiciones, no dudes en contactar con nosotros.
          </p>
          <p className={styles.contactText}>
            Email:{" "}
            <a href="mailto:legal@tutienda.com" className={styles.contactLink}>
              legal@tutienda.com
            </a>
          </p>
          <p className={styles.contactText}>
            Teléfono:{" "}
            <a href="tel:+34900000000" className={styles.contactLink}>
              900 000 000
            </a>{" "}
            (Lunes a Viernes, 9:00 - 18:00)
          </p>
        </div>
      </div>
    </div>
  )
}
