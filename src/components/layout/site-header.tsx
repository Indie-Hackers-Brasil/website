'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { ModeToggle } from '../toggle-theme';

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 transition-all hover:text-blue-600 dark:hover:text-blue-400 ${
        isActive
          ? 'font-medium text-blue-700 dark:text-blue-300'
          : 'text-neutral-700 dark:text-neutral-300'
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Indie Hackers Brasil</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/criadores">Criadores</NavLink>
          <NavLink href="/projetos">Projetos</NavLink>
          <NavLink href="/recursos">Recursos</NavLink>
          <NavLink href="/comunidade">Comunidade</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link
            href="/entrar"
            className="hidden px-4 py-2 text-sm font-medium text-neutral-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 sm:inline-block"
          >
            Entrar
          </Link>
          <Link
            href="/cadastrar"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
