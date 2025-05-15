import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-neutral-200 py-8 dark:border-neutral-800">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Indie Hackers Brasil</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Conectando empreendedores independentes para criarem produtos digitais lucrativos juntos.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Descubra
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link 
                  href="/criadores" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Criadores
                </Link>
              </li>
              <li>
                <Link 
                  href="/projetos" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Projetos
                </Link>
              </li>
              <li>
                <Link 
                  href="/recursos" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Recursos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Comunidade
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link 
                  href="/eventos" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link 
                  href="/forum" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Fórum
                </Link>
              </li>
              <li>
                <Link 
                  href="/discord" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Discord
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Links
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link 
                  href="/sobre" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link 
                  href="/contato" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacidade" 
                  className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 text-sm dark:border-neutral-800 md:flex-row">
          <p className="text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Indie Hackers Brasil. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com" className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">
              Twitter
            </a>
            <a href="https://github.com" className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">
              GitHub
            </a>
            <a href="https://linkedin.com" className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
