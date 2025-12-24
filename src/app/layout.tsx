
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CartProvider } from '@/context/CartContext';
import { SearchProvider } from '@/context/SearchContext';

export const metadata: Metadata = {
  title: 'Synergy Digital Suite',
  description: 'One unified ecosystem for all your digital products and services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SearchProvider>
          <CartProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </CartProvider>
        </SearchProvider>
        <Toaster />
      </body>
    </html>
  );
}
