import './globals.css';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/footer';

export const metadata = {
  title: 'Suplementos deportivos',
  description: 'Tienda online de suplementos deportivos y nutrición',
};
type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <header>
          <TopBar />
          <Header />
          <Navigation />
        </header>
        <main>{children}</main>
        <footer><Footer /></footer>
      </body>
    </html>
  );
}