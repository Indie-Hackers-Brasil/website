import projects from '@/data/projects';

export default function Page() {
  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Projetos</h1>
      <p>Conheça os projetos de produtos digitais brasileiros.</p>
      <div className="space-y-4 py-4">
        {projects.map((project, index) => (
          <a href={project.site} className="mt-2 inline-block" target="_blank" key={index}>
            <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-4 shadow-sm transition-all hover:scale-105 hover:border-violet-500 hover:shadow-md dark:border-neutral-800">
              <h2 className="text-xl font-semibold">{project.titulo}</h2>
              <p className="text-sm">{project.descricao}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
