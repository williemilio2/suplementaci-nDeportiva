import './globals.css';

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
        {children}
        </body>
    </html>
  );
}