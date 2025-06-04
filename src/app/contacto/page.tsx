import type { Metadata } from "next"
import styles from "../../styles/page.module.css"
import CustomCursor from "@/src/components/customCursor"

export const metadata: Metadata = {
  title: "Contacto | Atención al Cliente - Suplementación Deportiva",
  description:
    "Contacta con nuestro equipo de atención al cliente. Resolvemos tus dudas sobre pedidos, productos, envíos y devoluciones de suplementos deportivos.",
  openGraph: {
    title: "Contacto | Atención al Cliente - Suplementación Deportiva",
    description:
      "Contacta con nuestro equipo de atención al cliente. Resolvemos tus dudas sobre pedidos, productos, envíos y devoluciones.",
    url: "https://suplementaciondeportiva.es/contacto",
    type: "website",
  },
  alternates: {
    canonical: "https://suplementaciondeportiva.es/contacto",
  },
  keywords: "contacto suplementos deportivos, atención cliente, teléfono suplementos, email suplementación deportiva",
}

// Generar datos estructurados para la página de contacto
function generateContactStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto - Suplementación Deportiva",
    description: "Página de contacto de Suplementación Deportiva",
    url: "https://suplementaciondeportiva.es/contacto",
    mainEntity: {
      "@type": "Organization",
      name: "Suplementación Deportiva",
      telephone: "+34673385301",
      email: "contacto@suplementaciondeportiva.es",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+34673385301",
        email: "contacto@suplementaciondeportiva.es",
        contactType: "customer service",
        availableLanguage: "Spanish",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
    },
  }
}

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateContactStructuredData()),
        }}
      />
      <div className={styles.pageContainer}>
        <CustomCursor />
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Contacto</h1>
          <p className={styles.pageSubtitle}>
            ¿Tienes preguntas? Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo a través de los
            siguientes medios.
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
            <div className={styles.infoGridContacto}>
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
                  <a href="tel:+34673385301" className={styles.contactLink}>
                    673 385 301
                  </a>
                </p>
                <p className={styles.contactText}>(Horario laboral de Lunes a Viernes)</p>
              </div>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>¿Necesitas ayuda con tu pedido?</h3>
            <p className={styles.contactText}>
              Accede a tu cuenta para ver el estado de tu pedido en la sección &quot;pedidos&quot;. Si tienes alguna
              incidencia, no dudes en escribirnos con tu número de pedido.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
