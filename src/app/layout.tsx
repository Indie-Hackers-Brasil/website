import NavBar from '@/components/navbar';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Indie Hackers Brazil'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="size-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <body className="mx-auto flex size-full max-w-2xl flex-col gap-6 px-4 pb-24">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
