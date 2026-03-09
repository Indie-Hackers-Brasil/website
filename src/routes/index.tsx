import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className='max-w-6xl w-full mx-auto px-4 py-24'>
      <h1 className='w-full text-center text-2xl font-bold'>Olá mundo! 👋</h1>
      <p>Estamos em construção</p>
    </main>
  )
}
