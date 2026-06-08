import { Link, useParams } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { DefinirMissionsForm } from '@/components/stades/DefinirMissionsForm'
import { authStore } from '@/stores/authStore'

export default function DefinirMissionsPage() {
  const { projetId, numStade: numStr } = useParams({
    from: '/(dashboard)/_layout/projets/$projetId/stades/$numStade/definir-missions',
  })
  const user = authStore((state) => state.utilisateur)
  const numStade = parseInt(numStr, 10)

  if (user?.role !== 'MENTOR') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-[13px] text-zinc-500">Acces reserve aux mentors.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link
          to="/projets/$projetId/stades/$numStade"
          params={{ projetId, numStade: numStr }}
          className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Retour au stade {numStade}
        </Link>
      </div>

      <DefinirMissionsForm projetId={projetId} numStade={numStade} />
    </div>
  )
}
