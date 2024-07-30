import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

type ItemMenuProps = {
  children: ReactNode;
  href: string;
}

function ItemMenu({children, href}: ItemMenuProps) {
  return (
    <Link href={href} className='transition-all hover:text-neutral-800/60 dark:hover:text-neutral-200/60 flex align-middle relative py-1 px-2'>
      {children}
    </Link>
  )
}

export default function NavBar() {
  const menuItems = [
    {label: 'criadores', href: '/criadores'},
    {label: 'projetos', href: '/projetos'},
    {label: 'ideias', href: '/ideias'},
    {label: 'sobre', href: '/sobre'},
  ]

  return (
    <nav className='w-full py-6 sm:py-0 sm:h-24 sm:items-center justify-center gap-2 sm:justify-between flex flex-col sm:flex-row'>
      <Link href='/' className='font-bold text-2xl'>
        Indie Hackers Brasil
      </Link>

      <div className='flex -mx-2'>
        {menuItems.map((item, index) => (
          <ItemMenu key={index} href={item.href}>
            {item.label}
          </ItemMenu>
        ))}
      </div>
    </nav>
  )
}