
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/header';

export const metadata: Metadata = {
  title: 'Celestial OS | High-Fidelity Tracking',
  description: 'A minimalist high-fidelity visual representation of lunar phases and celestial positioning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-starlight selection:text-lunar">
        <Header />
        <div className="pt-16 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
