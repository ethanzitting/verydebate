import type { Metadata } from 'next';
import './globals.css';
import './live.css';
import { ProviderPyramid } from '@/app/components/providerPyramid';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'VeryDebate · Live transcript',
  description: 'A live, speaker-separated debate transcript.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen w-screen">
      <head>
        <title>Very Debate</title>
      </head>
      <body className="antialiased h-full w-full">
        <ProviderPyramid>{children}</ProviderPyramid>
      </body>
    </html>
  );
}
