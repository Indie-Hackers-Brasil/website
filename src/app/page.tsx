import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 text-balance text-center">
      <h1 className="text-3xl font-bold">Em desenvolvimento ⚠️</h1>
      <p>Estamos dedicados a trazer o melhor conteúdo para você. Fique ligado(a)!</p>
      <p><i>Enquanto isso, confira os <Link href="/projetos" className="text-blue-500 underline hover:text-blue-700">projetos</Link> que já estão disponíveis.</i></p>
    </main>
  );
}
