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
    <nav className='w-full h-24 items-center justify-between flex'>
      <Link href='/' className='font-bold'>
        Indie Hackers Brasil
      </Link>

      <div className='flex'>
        {menuItems.map((item, index) => (
          <ItemMenu key={index} href={item.href}>
            {item.label}
          </ItemMenu>
        ))}
      </div>
    </nav>
  )
}