import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useMesFormations } from '@/hooks/useFormations'
import { FormationCard } from '@/components/formations/FormationCard'
import { Loader2, Plus } from 'lucide-react'

const routeApi = getRouteApi('/(dashboard)/_layout/mes-formations/')

export default function MesFormationsPage() {
  const { page } = routeApi.useSearch()
  const navigate = useNavigate({ from:'/mes-formations/' })
  
  const { data, isLoading } = useMesFormations({
    page: page ?? 1,
    limite: 12,
  })

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] text-zinc-900">Mes Formations</h1>
        <button 
          onClick={() => navigate({ to: '/mes-formations/creer' })}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle formation
        </button>
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
              <FormationCard key={f.id} formation={f} basePath="/mes-formations" />
            ))
          )}
        </div>
      )}
    </div>
  )
}
