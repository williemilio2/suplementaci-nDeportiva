import './globals.css';
import LayoutWrapper from '../components/layoutWrapper'; // pon este archivo junto a layout.tsx
import { EliteProvider } from "@/src/components/eliteContent"

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
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body suppressHydrationWarning>
        <LayoutWrapper>
          <EliteProvider>{children}</EliteProvider>
        </LayoutWrapper>
      </body>
    </html>
  );
}
