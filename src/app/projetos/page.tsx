import projects from '../../data/projects';

export default function Page() {
  return (
    <main className="flex flex-col gap-2 text-balance">
      <h1 className="text-2xl font-bold">Projetos</h1>
      <p>Conheça os projetos de produtos digitais brasileiros.</p>
      <div className="space-y-4 py-4">
        {projects.map((project, index) => (
          <a href={project.site} className="mt-2 inline-block" target="_blank" key={index}>
            <div className="rounded border p-4 shadow-sm transition-transform ease-in-out hover:scale-105 hover:border-violet-500 hover:shadow-md">
              <h2 className="text-xl font-semibold">{project.titulo}</h2>
              <p>{project.descricao}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
