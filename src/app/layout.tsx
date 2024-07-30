import NavBar from '@/components/navbar';
import type { Metadata } from "next";
import type { ReactNode } from 'react';
import "./globals.css";

export const metadata: Metadata = {
  title: "Indie Hackers Brazil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" className='w-full h-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'>
      <body className='w-full max-w-2xl h-full flex px-4 flex-col mx-auto gap-6 pb-24'>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
