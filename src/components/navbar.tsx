import Link from 'next/link';
import type { ReactNode } from 'react';

type ItemMenuProps = {
  children: ReactNode;
  href: string;
};

function ItemMenu({ children, href }: ItemMenuProps) {
  return (
    <Link
      href={href}
      className="relative flex px-2 py-1 align-middle transition-all hover:text-neutral-800/60 dark:hover:text-neutral-200/60"
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const menuItems = [
    { label: 'criadores', href: '/criadores' },
    { label: 'projetos', href: '/projetos' },
    { label: 'ideias', href: '/ideias' },
    { label: 'sobre', href: '/sobre' }
  ];

  return (
    <nav className="flex w-full flex-col justify-center gap-2 py-6 sm:h-24 sm:flex-row sm:items-center sm:justify-between sm:py-0">
      <Link href="/" className="text-2xl font-bold">
        Indie Hackers Brasil
      </Link>

      <div className="-mx-2 flex">
        {menuItems.map((item, index) => (
          <ItemMenu key={index} href={item.href}>
            {item.label}
          </ItemMenu>
        ))}
      </div>
    </nav>
  );
}
