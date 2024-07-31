'use client'

import projects from '@/data/projects';

export default function Page() {
  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Projetos</h1>
      <p className='text-neutral-600 dark:text-neutral-400' >Conheça os projetos de produtos digitais brasileiros.</p>

      <div className="space-y-4 py-4">
        {projects.map((project, index) => (
          <a href={project.site} className="rounded-lg mt-2 block border border-neutral-200 group transition-all hover:scale-105 hover:border-violet-500 hover:shadow-md dark:border-neutral-800" target="_blank" key={index}>
            <div className="flex flex-col gap-2 p-4 shadow-sm">
              <div className="flex items-center gap-1">
                <h2 className="text-xl font-semibold">{project.titulo}</h2>

                <svg className="hidden group-hover:block text-violet-500" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                  <g id="Interface / External_Link">
                    <path
                      id="Vector"
                      d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">{project.descricao}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
