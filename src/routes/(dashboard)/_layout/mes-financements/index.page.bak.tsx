import { useState } from 'react'
import { useMesOffres } from '@/hooks/useInvestisseur'
import { OffreFinancementForm } from '@/components/financement/OffreFinancementForm'
import { Loader2, BadgeDollarSign, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

function StatutOffreBadge({ estActif }: { estActif: boolean }) {
  return (
    <span className={cn(
      'text-[10px] px-2 py-0.5 rounded-full border',
      estActif ? 'bg-green-50 text-green-700 border-green-200'
               : 'bg-zinc-100 text-zinc-500 border-zinc-200',
    )}>
      {estActif ? 'Active' : 'En attente validation'}
    </span>
  )
}

export default function MesFinancementsPage() {
  const { data: offres, isLoading } = useMesOffres()
  const [afficherFormulaire, setAfficherFormulaire] = useState(false)

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-zinc-900">Mes offres de financement</h1>
          <p className="text-[12px] text-zinc-500 mt-1">Gérez vos offres et consultez les candidatures.</p>
        </div>
        <button
          onClick={() => setAfficherFormulaire(true)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />Nouvelle offre
        </button>
      </div>

      {afficherFormulaire && (
        <OffreFinancementForm onClose={() => setAfficherFormulaire(false)} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-green-600" /></div>
      ) : !offres || offres.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
            <BadgeDollarSign className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-[13px] text-zinc-500">Vous n'avez publié aucune offre.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {offres.map((offre) => (
            <div key={offre.id} className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-medium text-zinc-800 truncate">{offre.titre}</p>
                  <StatutOffreBadge estActif={offre.est_actif} />
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {offre.type_financement} · BRL min {offre.brl_minimal} · {offre.nb_candidatures} candidature{offre.nb_candidatures > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
