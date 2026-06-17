import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/header';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Moonbug | Productivity & Learning OS',
  description: 'An offline-first platform for productivity notes, voice input, and educational rewards.',
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
        <FirebaseClientProvider>
          <Header />
          <div className="pt-16 min-h-screen relative z-10">
            {children}
          </div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}