'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import styles from "../styles/Navigation.module.css";

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);


  const navItems = [
    {
      name: "Suplementos",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Ganar músculo",
          links: [
            { nameLink: "Proteina", linkUrl: "/suplementos/ganar-musculo/proteina" },
            { nameLink: "Mass gainer", linkUrl: "/suplementos/ganar-musculo/mass-gainer" },
            { nameLink: "Creatina", linkUrl: "/suplementos/ganar-musculo/creatina" }
          ]
        },
        {
          title: "Mejorar salud",
          links: [
            { nameLink: "Vitaminas C", linkUrl: "/suplementos/mejorar-salud/vitaminas-c" },
            { nameLink: "Omega-3", linkUrl: "/suplementos/mejorar-salud/omega-3" },
            { nameLink: "Multivitamínicos", linkUrl: "/suplementos/mejorar-salud/multivitaminicos" }
          ]
        },
        {
          title: "Perder grasa",
          links: [
            { nameLink: "Quemadores de grasa", linkUrl: "/suplementos/perder-grasa/quemadores" },
            { nameLink: "L-carnitina", linkUrl: "/suplementos/perder-grasa/l-carnitina" },
            { nameLink: "Té verde", linkUrl: "/suplementos/perder-grasa/te-verde" }
          ]
        },
        {
          title: "Recuperación",
          links: [
            { nameLink: "Glutamina", linkUrl: "/suplementos/recuperacion/glutamina" },
            { nameLink: "BCAAs", linkUrl: "/suplementos/recuperacion/bcaas" },
            { nameLink: "EAAs", linkUrl: "/suplementos/recuperacion/eaas" }
          ]
        },
      ],
    },
    {
      name: "Dietas",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Dietas para ganar masa muscular",
          links: [
            { nameLink: "Dieta alta en proteínas", linkUrl: "/dietas/ganar-masa-muscular/alta-en-proteinas" },
            { nameLink: "Dieta para volumen", linkUrl: "/dietas/ganar-masa-muscular/para-volumen" }
          ]
        },
        {
          title: "Dietas para perder peso",
          links: [
            { nameLink: "Dieta cetogénica", linkUrl: "/dietas/perder-peso/cetogenica" },
            { nameLink: "Dieta baja en carbohidratos", linkUrl: "/dietas/perder-peso/baja-en-carbohidratos" },
            { nameLink: "Ayuno intermitente", linkUrl: "/dietas/perder-peso/ayuno-intermitente" }
          ]
        },
        {
          title: "Dietas vegetarianas y veganas",
          links: [
            { nameLink: "Dieta vegetariana", linkUrl: "/dietas/vegetarianas-veganas/vegetariana" },
            { nameLink: "Dieta vegana", linkUrl: "/dietas/vegetarianas-veganas/vegana" },
            { nameLink: "Suplementos para veganos", linkUrl: "/dietas/vegetarianas-veganas/suplementos" }
          ]
        }
      ]
    },
    {
      name: "Accesorios",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Equipamiento de entrenamiento",
          links: [
            { nameLink: "Mancuernas", linkUrl: "/accesorios/equipamiento/mancuernas" },
            { nameLink: "Barras y discos", linkUrl: "/accesorios/equipamiento/barras-discos" },
            { nameLink: "Kettlebells", linkUrl: "/accesorios/equipamiento/kettlebells" }
          ]
        },
        {
          title: "Ropa deportiva",
          links: [
            { nameLink: "Camisetas", linkUrl: "/accesorios/ropa/camisetas" },
            { nameLink: "Pantalones de yoga", linkUrl: "/accesorios/ropa/pantalones-yoga" },
            { nameLink: "Zapatillas deportivas", linkUrl: "/accesorios/ropa/zapatillas" }
          ]
        },
        {
          title: "Suplementos para entrenamiento",
          links: [
            { nameLink: "Shakers", linkUrl: "/accesorios/suplementos/shakers" },
            { nameLink: "Botellas de agua", linkUrl: "/accesorios/suplementos/botellas" },
            { nameLink: "Accesorios para fitness", linkUrl: "/accesorios/suplementos/accesorios" }
          ]
        }
      ]
    },
    {
      name: "Ofertas",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Descuentos en suplementos",
          links: [
            { nameLink: "Descuento en proteínas", linkUrl: "/ofertas/descuento/proteinas" },
            { nameLink: "Descuento en creatinas", linkUrl: "/ofertas/descuento/creatinas" },
            { nameLink: "Descuentos por volumen", linkUrl: "/ofertas/descuento/volumen" }
          ]
        },
        {
          title: "Ofertas en ropa deportiva",
          links: [
            { nameLink: "Descuento en camisetas", linkUrl: "/ofertas/ropa/camisetas" },
            { nameLink: "Descuento en pantalones", linkUrl: "/ofertas/ropa/pantalones" },
            { nameLink: "Descuento en zapatillas", linkUrl: "/ofertas/ropa/zapatillas" }
          ]
        }
      ]
    },
    {
      name: "Marcas",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Nuestras marcas",
          links: [
            { nameLink: "HSN", linkUrl: "/marcas/hsn" },
            { nameLink: "Optimum Nutrition", linkUrl: "/marcas/optimum-nutrition" },
            { nameLink: "MyProtein", linkUrl: "/marcas/myprotein" }
          ]
        },
        {
          title: "Marcas destacadas",
          links: [
            { nameLink: "Scitec Nutrition", linkUrl: "/marcas/scitec" },
            { nameLink: "BiotechUSA", linkUrl: "/marcas/biotech" },
            { nameLink: "Prozis", linkUrl: "/marcas/prozis" }
          ]
        }
      ]
    },
    {
      name: "Blog",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Consejos de entrenamiento",
          links: [
            { nameLink: "Rutinas de fuerza", linkUrl: "/blog/entrenamiento/rutinas-fuerza" },
            { nameLink: "HIIT vs cardio", linkUrl: "/blog/entrenamiento/hiit-vs-cardio" },
            { nameLink: "Errores comunes", linkUrl: "/blog/entrenamiento/errores-comunes" }
          ]
        },
        {
          title: "Nutrición y salud",
          links: [
            { nameLink: "Cómo leer etiquetas", linkUrl: "/blog/nutricion/leer-etiquetas" },
            { nameLink: "Alimentos saludables", linkUrl: "/blog/nutricion/alimentos-saludables" },
            { nameLink: "Suplementos esenciales", linkUrl: "/blog/nutricion/suplementos-esenciales" }
          ]
        }
      ]
    },
    {
      name: "Nosotros",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Quiénes somos",
          links: [
            { nameLink: "Historia", linkUrl: "/nosotros/historia" },
            { nameLink: "Equipo", linkUrl: "/nosotros/equipo" },
            { nameLink: "Misión y visión", linkUrl: "/nosotros/mision-vision" }
          ]
        },
        {
          title: "Compromisos",
          links: [
            { nameLink: "Calidad y sostenibilidad", linkUrl: "/nosotros/calidad-sostenibilidad" },
            { nameLink: "Opiniones de clientes", linkUrl: "/nosotros/opiniones" },
            { nameLink: "Colaboraciones", linkUrl: "/nosotros/colaboraciones" }
          ]
        }
      ]
    },
    {
      name: "CONTACTO",
      hasDropdown: false
    },
    {
      name: "TOP VENTAS",
      hasDropdown: false,
    },
    {
      name: "NOVEDADES",
      hasDropdown: false,
    }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setActiveDropdown(null);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={styles.nav}>
      <Image
        src={'/logoLetras.png'}
        width={110}
        height={35}
        alt={'logoLetras'}
        className={styles.navBarImage}
      />
      <div className={styles.navContainer}>
        {navItems.map((item, index) => (
          <div
            key={index}
            className={styles.navItem}
            onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
            onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
          >
            <div className={`${styles.navLink} ${!item.hasDropdown ? `${styles.remarcado} hoverable` : ''}`}>
              {item.name}
              {item.hasDropdown && <ChevronDown size={16} className={styles.icon} style={activeDropdown === index ? { transition: 'transform 0.3s' } : {  transform: 'rotate(-90deg)', transition: 'transform 0.3s' }}/>}
            </div>

            {item.hasDropdown && activeDropdown === index && (
              <div className={styles.dropdown}>
                {item.dropdownContent?.map((category, catIndex) => (
                  <div key={catIndex} className={styles.dropdownCategory}>
                    <h4 className={styles.dropdownTitle}>{category.title}</h4>
                    <ul className={styles.dropdownList}>
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link href={link.linkUrl} className={`${styles.dropdownLink} hoverable`}>
                            {link.nameLink}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
