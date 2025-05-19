'use client';

import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './footer';

type Props = {
  children: React.ReactNode;
};

export default function LayoutWrapper({ children }: Props) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    // Layout alternativo para /admin
    return (
      <>
        {/* Aquí puedes poner otro header o nada */}
        <main>{children}</main>
        {/* Otro footer o nada */}
      </>
    );
  }

  // Layout general para resto de la app
  return (
    <>
      <header>
        <TopBar />
        <Header />
        <Navigation />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
