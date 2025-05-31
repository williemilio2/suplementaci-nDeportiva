"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X, ChevronRight, Salad, BicepsFlexed, CircleFadingArrowUp, Cross, BadgeDollarSign  } from "lucide-react"
import styles from "../styles/Navigation.module.css"

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<number | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navItems = [
    {
      name: "Suplementos",
      hasDropdown: true,
      dropdownContent: [
        {
          title: "Ganar músculo",
          icon: BicepsFlexed,
          links: [
            { nameLink: "Proteina", linkUrl: "/especiales?t=proteinas" },
            { nameLink: "Mass gainer", linkUrl: "/especiales?t=massGainer" },
            { nameLink: "Creatina", linkUrl: "/especiales?t=Creatina" },
          ],
        },
        {
          title: "Mejorar salud",
          icon: Salad,
          links: [
            { nameLink: "Vitaminas C", linkUrl: "/especiales?t=vitaminaC" },
            { nameLink: "Omega-3", linkUrl: "/especiales?t=Omega-3" },
            { nameLink: "Multivitamínicos", linkUrl: "/especiales?t=Multivitamínicos" },
          ],
        },
        {
          title: "Perder grasa",
          icon: Cross,
          links: [
            { nameLink: "Quemadores de grasa", linkUrl: "/especiales?t=QuemadoresGrasa" },
          ],
        },
        {
          title: "Recuperación",
          icon: CircleFadingArrowUp,
          links: [
            { nameLink: "Glutamina", linkUrl: "/especiales?t=Glutamina" },
            { nameLink: "BCAAs", linkUrl: "/especiales?t=BCAAs" },
            { nameLink: "EAAs", linkUrl: "/especiales?t=EAAs" },
          ],
        },
      ],
    },
    {
      name: "Ofertas",
      hasDropdown: true,
      //icon: HandCoins,
      dropdownContent: [
        {
          title: "Descuentos en suplementos",
          icon: BadgeDollarSign,
          links: [
            { nameLink: "Descuento en proteínas", linkUrl: "/ofertas/descuento/proteinas" },
            { nameLink: "Descuento en creatinas", linkUrl: "/ofertas/descuento/creatinas" },
            { nameLink: "Descuentos por volumen", linkUrl: "/ofertas/descuento/volumen" },
          ],
        },
      ],
    },{
      name: "Historial Pedidos",
      hasDropdown: false,
      linkUrl: "/pedidos",
    },
    {
      name: "CONTACTO",
      hasDropdown: false,
      linkUrl: "/contacto",
    },
    {
      name: "TOP VENTAS",
      hasDropdown: false,
      linkUrl: "/topVentas",
      highlight: true,
    },
    {
      name: "NOVEDADES",
      hasDropdown: false,
      linkUrl: "/novedades",
      highlight: true,
    },
    {
      name: "Club elite",
      hasDropdown: false,
      linkUrl: "/clubElite",
      highlight: true,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setActiveDropdown(null)
    }

    const handleResize = () => {
      setActiveDropdown(null)
      setMobileMenuOpen(false)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    // Disable body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const handleDropdownToggle = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(index)
    }
  }

  const handleMobileSubmenuToggle = (index: number) => {
    if (mobileSubmenuOpen === index) {
      setMobileSubmenuOpen(null)
    } else {
      setMobileSubmenuOpen(index)
    }
  }

  return (
    <>
      <nav className={styles.nav} ref={navRef}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logoContainer}>
            <Image src="/logoLetras.png" width={110} height={35} alt="Logo" className={styles.navBarImage} />
          </Link>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`${styles.navContainer} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
            <div className={styles.mobileMenuHeader}>
              <Image src="/logoLetras.png" width={100} height={32} alt="Logo" />
              <button
                className={styles.mobileCloseButton}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            {navItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.navItemWrapper}`}
                onMouseLeave={() => !mobileMenuOpen && setActiveDropdown(null)}
              >
                <div
                  key={index}
                  className={`${styles.navItem} ${activeDropdown === index ? styles.active : ""} ${item.highlight ? styles.highlighted : ""}`}
                >
                  {item.hasDropdown ? (
                    <>
                      <button
                        className={styles.navLink}
                        onClick={() => {
                          if (mobileMenuOpen) {
                            handleMobileSubmenuToggle(index)
                          } else {
                            handleDropdownToggle(index)
                          }
                        }}
                        onMouseEnter={() => !mobileMenuOpen && item.hasDropdown && setActiveDropdown(index)}
                        aria-expanded={activeDropdown === index}
                        aria-haspopup="true"
                      >
                        {/*<item.icon size={18} className={styles.navIcon} />*/}
                        {item.name}
                        <ChevronDown
                          size={16}
                          className={`${styles.icon} ${activeDropdown === index || mobileSubmenuOpen === index ? styles.iconRotated : ""}`}
                        />
                      </button>

                      {/* Desktop dropdown */}
                      {!mobileMenuOpen && activeDropdown === index && (
                        <div className={styles.dropdownBackdrop} onMouseLeave={() => setActiveDropdown(null)}>
                          <div className={styles.dropdown} ref={dropdownRef}>
                            <div className={styles.dropdownInner}>
                              {item.dropdownContent?.map((category, catIndex) => (
                                <div key={catIndex} className={styles.dropdownCategory}>
                                  <div className={styles.titleWithIcon}>
                                    <h4 className={styles.dropdownTitle}>{category.title}</h4>
                                    {category.icon && (
                                      <category.icon width={35} height={35} />
                                    )}
                                  </div>

                                  <ul className={styles.dropdownList}>
                                    {category.links.map((link, linkIndex) => (
                                      <li key={linkIndex}>
                                        <Link
                                          href={link.linkUrl}
                                          className={`${styles.dropdownLink} hoverable`}
                                          onClick={() => setActiveDropdown(null)}
                                        >
                                          {link.nameLink}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                            ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mobile submenu */}
                      {mobileMenuOpen && mobileSubmenuOpen === index && (
                        <div className={styles.mobileSubmenu}>
                          {item.dropdownContent?.map((category, catIndex) => (
                            <div key={catIndex} className={styles.mobileCategory}>
                              <h4 className={styles.mobileCategoryTitle}>{category.title}</h4>
                              <ul className={styles.mobileCategoryList}>
                                {category.links.map((link, linkIndex) => (
                                  <li key={linkIndex}>
                                    <Link
                                      href={link.linkUrl}
                                      className={styles.mobileCategoryLink}
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {link.nameLink}
                                      <ChevronRight size={16} />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.linkUrl || "#"}
                      className={`${styles.navLink} ${styles.navLinkStandalone} hoverable`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />}
    </>
  )
}
