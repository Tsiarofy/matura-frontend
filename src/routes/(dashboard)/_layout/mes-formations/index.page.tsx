import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useMesFormations, useSupprimerFormation } from '@/hooks/useFormations'
import { FormationCard } from '@/components/formations/FormationCard'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'

const routeApi = getRouteApi('/(dashboard)/_layout/mes-formations/')

export default function MesFormationsPage() {
  const { page } = routeApi.useSearch()
  const navigate = useNavigate({ from:'/mes-formations/' })
  const supprimerFormation = useSupprimerFormation()

  const { data, isLoading } = useMesFormations({
    page: page ?? 1,
    limite: 12,
  })

  const handleDelete = (formationId: string, titre: string) => {
    const confirmed = window.confirm(
      `Supprimer la formation "${titre}" ? Cette action supprimera aussi ses leçons publiées et peut impacter des entrepreneurs qui la consultent deja.`
    )
    if (!confirmed) return
    supprimerFormation.mutate(formationId)
  }

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">Mes formations</h1>
        <Button onClick={() => navigate({ to: '/mes-formations/creer' })} variant="outline">
          <Plus className="w-4 h-4" />
          Nouvelle formation
        </Button>
      </div>

      {/* Grille de formations */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.formations.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 text-[13px]">
              Vous n'avez pas encore créé de formations.
            </div>
          ) : (
            data?.formations.map((f) => (
              <FormationCard
                key={f.id}
                formation={f}
                basePath="/mes-formations"
                onDelete={(formation) => handleDelete(formation.id, formation.titre)}
                isDeleting={supprimerFormation.isPending && supprimerFormation.variables === f.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
