import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function PreguntasFrecuentesPage() {
  return (
    <div className={styles.pageContainer}>
            <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Preguntas Frecuentes</h1>
        <p className={styles.pageSubtitle}>
          Encuentra respuestas a las dudas más comunes sobre nuestros productos y servicios.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pedidos y Compras</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cómo puedo realizar un pedido?</h3>
            <p className={styles.faqAnswer}>
              Puedes realizar tu pedido a través de nuestra tienda online. Simplemente navega por nuestro catálogo,
              añade los productos que desees a tu carrito y sigue el proceso de compra. Necesitarás crear una cuenta o
              iniciar sesión para completar tu pedido.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Puedo modificar o cancelar mi pedido?</h3>
            <p className={styles.faqAnswer}>
              Puedes modificar o cancelar tu pedido siempre que no haya sido procesado. Para ello, accede a tu cuenta,
              ve a &quot;Mis Pedidos&quot; y selecciona la opción correspondiente. Si el pedido ya ha sido procesado, contacta con
              nuestro servicio de atención al cliente lo antes posible.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cómo puedo hacer seguimiento de mi pedido?</h3>
            <p className={styles.faqAnswer}>
              Una vez que tu pedido haya sido enviado, recibirás un email con el número de seguimiento y las
              instrucciones para rastrear tu paquete. También puedes consultar el estado de tu pedido en tu cuenta, en
              la sección &quot;Mis Pedidos&quot;.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Productos</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cómo sé qué producto es el adecuado para mí?</h3>
            <p className={styles.faqAnswer}>
              En cada ficha de producto encontrarás información detallada sobre sus características, beneficios y modo
              de uso. Si tienes dudas específicas, puedes utilizar nuestro chat en vivo o contactar con nuestro equipo
              de asesores nutricionales que te ayudarán a elegir el producto más adecuado para tus necesidades.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Los productos tienen certificaciones de calidad?</h3>
            <p className={styles.faqAnswer}>
              Sí, todos nuestros productos cumplen con los estándares de calidad europeos y están fabricados bajo
              estrictos controles. Muchos de ellos cuentan con certificaciones específicas como GMP (Good Manufacturing
              Practices), ISO 9001, o certificaciones de productos orgánicos o veganos, que puedes consultar en la
              descripción de cada producto.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Puedo consumir estos productos si tengo alergias o intolerancias?</h3>
            <p className={styles.faqAnswer}>
              En la ficha de cada producto encontrarás información detallada sobre los alérgenos presentes. Además,
              disponemos de una amplia gama de productos específicos para personas con intolerancias o alergias, como
              productos sin gluten, sin lactosa o hipoalergénicos. Si tienes dudas, consulta con tu médico antes de
              consumir cualquier suplemento.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Envíos y Devoluciones</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cuánto tiempo tarda en llegar mi pedido?</h3>
            <p className={styles.faqAnswer}>
              El tiempo de entrega depende del método de envío seleccionado. El envío estándar suele tardar entre 3-5
              días laborables, mientras que el envío express se entrega en 24-48 horas (días laborables). Para más
              detalles, consulta nuestra página de{" "}
              <a href="/envios-entregas" className={styles.contactLink}>
                Envíos y Entregas
              </a>
              .
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cuál es el coste de envío?</h3>
            <p className={styles.faqAnswer}>
              El coste de envío estándar es de 4.95€, pero es gratuito para pedidos superiores a 50€ en península. Para
              envíos express o a islas, consulta nuestra página de{" "}
              <a href="/envios-entregas" className={styles.contactLink}>
                Envíos y Entregas
              </a>
              .
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cómo puedo devolver un producto?</h3>
            <p className={styles.faqAnswer}>
              Dispones de 30 días desde la recepción del pedido para solicitar una devolución. Para iniciar el proceso,
              accede a tu cuenta, ve a &quot;Mis Pedidos&quot; y sigue las instrucciones. Para más información, consulta nuestra
              <a href="/devoluciones" className={styles.contactLink}>
                Política de Devoluciones
              </a>
              .
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pagos</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Qué métodos de pago aceptáis?</h3>
            <p className={styles.faqAnswer}>
              Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal, transferencia bancaria
              y pago contra reembolso (con coste adicional). Para más detalles, consulta nuestra página de
              <a href="/metodos-pago" className={styles.contactLink}>
                Métodos de Pago
              </a>
              .
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Es seguro comprar en vuestra web?</h3>
            <p className={styles.faqAnswer}>
              Sí, nuestra web utiliza protocolos de seguridad SSL para encriptar toda la información sensible. Además,
              no almacenamos datos de tarjetas de crédito. Todos los pagos se procesan a través de pasarelas de pago
              seguras y certificadas.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>¿Cuándo se realiza el cargo de mi compra?</h3>
            <p className={styles.faqAnswer}>
              El cargo se realiza en el momento de confirmar tu pedido, excepto en el caso de transferencia bancaria,
              donde deberás realizar el pago manualmente. Tu pedido no se procesará hasta que se confirme el pago.
            </p>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>¿No has encontrado respuesta a tu pregunta?</h3>
          <p className={styles.contactText}>
            Si tienes alguna otra duda o consulta, no dudes en contactar con nuestro equipo de atención al cliente.
          </p>
          <p className={styles.contactText}>
            Email:{" "}
            <a href="mailto:contacto@suplementaciondeportiva.es" className={styles.contactLink}>
              contacto@suplementaciondeportiva.es
            </a>
          </p>
          <p className={styles.contactText}>
            Teléfono:{" "}
            <a href="tel:+34900000000" className={styles.contactLink}>
              900 000 000
            </a>{" "}
            (Lunes a Viernes, 9:00 - 18:00)
          </p>
          <p className={styles.contactText}>
            También puedes utilizar nuestro chat en vivo disponible en la parte inferior derecha de la pantalla.
          </p>
        </div>
      </div>
    </div>
  )
}
