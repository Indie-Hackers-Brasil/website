import { H1, P } from '@/components/ui/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className='max-w-6xl w-full mx-auto px-4 py-24'>
      <H1 className='text-center'>Olá mundo! 👋</H1>
      <P className='text-center'>Estamos em construção</P>
    </main>
  )
}
