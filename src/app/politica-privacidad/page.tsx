'use client'
import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"
import { useState } from "react"

function deleteCookie(name: string) {
  document.cookie = name + '=; Max-Age=0; path=/;'
}

export default function PoliticaPrivacidadPage() {
  const [cookieDeleted, setCookieDeleted] = useState(false);

  const handleDeleteCookie = () => {
    deleteCookie('token');
    setCookieDeleted(true);
  };

  return (
    <div className={styles.pageContainer}>
            <CustomCursor />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Política de Privacidad</h1>
        <p className={styles.pageSubtitle}>
          Información sobre cómo recopilamos, utilizamos y protegemos tus datos personales.
        </p>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Responsable del Tratamiento</h2>
          <p>
            <strong>Nombre de la empresa:</strong> Suplementacion deportiva SL
            <br />
            <strong>Dirección:</strong> Calle Ejemplo, 123, 28001 Madrid
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:contacto@suplementaciondeportiva.es" className={styles.contactLink}>
              contacto@suplementaciondeportiva.es
            </a>
            <br />
            <strong>Teléfono:</strong> 673 385 301
            <br />
            <strong>CIF:</strong> B12345678
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos que Recopilamos</h2>
          <p>Recopilamos los siguientes tipos de información personal:</p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              <strong>Datos de identificación:</strong> Nombre, apellidos, dirección, teléfono, email.
            </li>
            <li className={styles.infoListItem}>
              <strong>Datos de facturación:</strong> Dirección de facturación, datos fiscales si procede.
            </li>
            <li className={styles.infoListItem}>
              <strong>Datos de compra:</strong> Historial de pedidos, productos adquiridos, preferencias.
            </li>
            <li className={styles.infoListItem}>
              <strong>Datos de navegación:</strong> Dirección IP, cookies, páginas visitadas, tiempo de permanencia.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Finalidad del Tratamiento</h2>
          <p>Utilizamos tus datos personales para los siguientes fines:</p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              Gestionar tu cuenta de usuario y proporcionarte acceso a las funcionalidades de nuestra web.
            </li>
            <li className={styles.infoListItem}>
              Procesar y gestionar tus pedidos, incluyendo el envío y la facturación.
            </li>
            <li className={styles.infoListItem}>
              Atender tus consultas, solicitudes o reclamaciones a través de nuestro servicio de atención al cliente.
            </li>
            <li className={styles.infoListItem}>
              Enviarte comunicaciones comerciales sobre nuestros productos y servicios, siempre que hayas dado tu
              consentimiento.
            </li>
            <li className={styles.infoListItem}>
              Mejorar nuestros productos y servicios mediante el análisis de tus preferencias y comportamiento de
              compra.
            </li>
            <li className={styles.infoListItem}>Cumplir con nuestras obligaciones legales y fiscales.</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Base Legal</h2>
          <p>El tratamiento de tus datos personales se basa en las siguientes bases legales:</p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              <strong>Ejecución de un contrato:</strong> Para gestionar tu cuenta, procesar tus pedidos y proporcionar
              nuestros servicios.
            </li>
            <li className={styles.infoListItem}>
              <strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales y el uso de cookies no
              esenciales.
            </li>
            <li className={styles.infoListItem}>
              <strong>Interés legítimo:</strong> Para mejorar nuestros productos y servicios, y para prevenir fraudes.
            </li>
            <li className={styles.infoListItem}>
              <strong>Obligación legal:</strong> Para cumplir con nuestras obligaciones fiscales y otras obligaciones
              legales.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Conservación de los Datos</h2>
          <p>
            Conservaremos tus datos personales durante el tiempo necesario para cumplir con los fines para los que
            fueron recogidos, incluyendo el cumplimiento de obligaciones legales, fiscales o de información.
          </p>
          <p>
            Los datos relacionados con tus compras se conservarán durante el tiempo exigido por la normativa fiscal
            (generalmente 5 años). Los datos para el envío de comunicaciones comerciales se conservarán hasta que
            solicites su supresión.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Destinatarios de los Datos</h2>
          <p>Tus datos personales podrán ser comunicados a:</p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              Proveedores de servicios que necesitan acceder a tus datos para prestarnos servicios (empresas de
              transporte, servicios de pago, servicios de alojamiento web, etc.).
            </li>
            <li className={styles.infoListItem}>
              Administraciones públicas cuando así lo exija la normativa aplicable.
            </li>
          </ul>
          <p>
            No realizamos transferencias internacionales de datos fuera del Espacio Económico Europeo (EEE), salvo que
            sea necesario para la ejecución de un contrato o para cumplir con obligaciones legales.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              <strong>Acceso:</strong> Conocer qué datos personales tuyos estamos tratando.
            </li>
            <li className={styles.infoListItem}>
              <strong>Rectificación:</strong> Modificar tus datos personales cuando sean inexactos o incompletos.
            </li>
            <li className={styles.infoListItem}>
              <strong>Supresión:</strong> Solicitar la eliminación de tus datos personales.
            </li>
            <li className={styles.infoListItem}>
              <strong>Limitación:</strong> Solicitar la limitación del tratamiento de tus datos.
            </li>
            <li className={styles.infoListItem}>
              <strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado y transmitirlos a otro
              responsable.
            </li>
            <li className={styles.infoListItem}>
              <strong>Oposición:</strong> Oponerte al tratamiento de tus datos.
            </li>
          </ul>
          <p>
            Puedes ejercer estos derechos enviando un email a{" "}
            <a href="mailto:contacto@suplementaciondeportiva.es" className={styles.contactLink}>
              contacto@suplementaciondeportiva.es
            </a>
            o por correo postal a la dirección indicada anteriormente, adjuntando copia de tu DNI o documento
            equivalente.
          </p>
          <p>
            También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos
            (www.aepd.es).
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookies</h2>
          <p>
            Nuestra web utiliza cookies propias y de terceros para mejorar tu experiencia de navegación, analizar tu
            comportamiento y personalizar el contenido. Puedes obtener más información en nuestra{" "}
            <a href="/cookies" className={styles.contactLink}>
              Política de Cookies
            </a>
            .
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Modificaciones</h2>
          <p>
            Podemos modificar esta Política de Privacidad para adaptarla a nuevas exigencias legislativas,
            jurisprudenciales o por motivos técnicos. Cuando se produzcan cambios significativos, te lo notificaremos
            por los canales habituales de comunicación.
          </p>
          <p>Última actualización: 15 de mayo de 2023</p>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Eliminar Cookies</h2>
          <p>Si deseas eliminar sus cookies, pulsa el botón siguiente:</p>
          <button
            className={styles.deleteCookieButton}
            onClick={handleDeleteCookie}
          >
            Eliminar cookie
          </button>
          <p>Recuerda que una vez la elimines deberás volver a iniciar sesión si quieres volver a tener tu cuenta</p>
          {cookieDeleted && (
            <p style={{ color: 'green', marginTop: '0.5rem' }}>
              La cookie ha sido eliminada.
            </p>
          )}
        </div>
        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Contacto sobre Privacidad</h3>
          <p className={styles.contactText}>
            Si tienes alguna pregunta sobre nuestra Política de Privacidad o sobre cómo tratamos tus datos personales,
            no dudes en contactar con nuestro Delegado de Protección de Datos.
          </p>
          <p className={styles.contactText}>
            Email:{" "}
            <a href="mailto:contacto@suplementaciondeportiva.es" className={styles.contactLink}>
              contacto@suplementaciondeportiva.es
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
