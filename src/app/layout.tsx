import './globals.css';
import type { Metadata, Viewport } from 'next';
import { SerwistProvider } from '@serwist/turbopack/react';
import { UpdateBanner } from '@/shared/ui/UpdateBanner';

const APP_NAME = 'Морской boy';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: 'Морской boy',
  description: 'Морской boy — PvP на одном экране. Работает офлайн.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#1c1917',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="size-full">
      <body className={`antialiased size-full`}>
        <SerwistProvider swUrl="/serwist/sw.js">
          {children}
          <UpdateBanner />
        </SerwistProvider>
      </body>
    </html>
  );
}
