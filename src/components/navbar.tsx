'use client';

import { IconBrandGithub } from '@tabler/icons-react';
import c from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type ItemMenuProps = {
  children: ReactNode;
  href: string;
  active?: boolean;
  icon?: ReactNode;
};

function ItemMenu({ children, href, active, icon }: ItemMenuProps) {
  return (
    <Link
      href={href}
      className={c(
        'relative flex items-center px-2 py-1 align-middle decoration-neutral-900 underline-offset-4 transition-all hover:text-neutral-800/60 hover:underline dark:decoration-neutral-100 dark:hover:text-neutral-200/60',
        active && 'underline'
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'criadores', href: '/criadores' },
    { label: 'projetos', href: '/projetos' },
    { label: 'ideias', href: '/ideias' },
    { label: 'sobre', href: '/sobre' },
    { href: 'https://github.com/Indie-Hackers-Brasil/website', icon: <IconBrandGithub /> }
  ];

  return (
    <nav className="sticky top-0 flex h-auto w-full flex-col justify-center gap-2 bg-neutral-100 py-6 sm:h-24 sm:flex-row sm:items-center sm:justify-between sm:py-0 dark:bg-neutral-900">
      <Link href="/" className="text-2xl font-bold">
        Indie Hackers Brasil
      </Link>

      <div className="-mx-2 flex">
        {menuItems.map((item, index) => {
          const active = pathname === item.href;

          return (
            <ItemMenu key={index} href={item.href} active={active} icon={item.icon}>
              {item.label}
            </ItemMenu>
          );
        })}
      </div>
    </nav>
  );
}
