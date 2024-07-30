import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indie Hackers Brazil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className='w-full h-full'>
      <body className='w-full h-full flex items-center justify-center px-4'>
        {children}
      </body>
    </html>
  );
}
