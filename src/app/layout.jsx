import './globals.css';

export const metadata = {
  title: 'Suplementos deportivos',
  description: 'Tienda online de suplementos deportivos y nutrición',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        </body>
    </html>
  );
}