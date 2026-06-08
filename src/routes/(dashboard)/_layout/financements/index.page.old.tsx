import { useState } from 'react'
import { useOffres, type OffreFinancement } from '@/hooks/useFinancements'
import { useProjets } from '@/hooks/useProjets'
import { PostulerModal } from '@/components/financement/PostulerModal'
import { FinancementCard } from '@/components/financement/FinancementCard'
import { Loader2, BadgeDollarSign } from 'lucide-react'

export default function FinancementsPage() {
  // On charge tous les projets (limite: 100) pour être sûr d'avoir les projets DIPLOME avec BRL >= 6
  const { data: projetsData } = useProjets({ page: 1, limite: 100 })
  
  // Tri des projets: les DIPLOME en premier, puis par BRL décroissant
  const mesProjets = [...(projetsData?.projets ?? [])].sort((a, b) => {
    if (a.statut === 'DIPLOME' && b.statut !== 'DIPLOME') return -1
    if (b.statut === 'DIPLOME' && a.statut !== 'DIPLOME') return 1
    return b.brl_actuel - a.brl_actuel
  })

  const [projetActifId, setProjetActifId] = useState<string | undefined>(undefined)
  const { data, isLoading } = useOffres({ projet_id: projetActifId })
  const offres = data?.offres ?? []
  const [offreSelectionnee, setOffreSelectionnee] = useState<OffreFinancement | null>(null)

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-[20px] text-zinc-900">Financements disponibles</h1>
        <p className="text-[12px] text-zinc-500 mt-1">
          Consultez les offres et postulez avec votre projet. (Seuls les projets avec un BRL ≥ 6 sont éligibles)
        </p>
      </div>

      {mesProjets && mesProjets.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3">
          <p className="text-[12px] text-zinc-500 shrink-0">Postuler avec :</p>
          <select
            className="flex-1 text-[12px] text-zinc-700 bg-transparent outline-none"
            value={projetActifId ?? ''}
            onChange={(e) => setProjetActifId(e.target.value || undefined)}
          >
            <option value="">— Tous les projets —</option>
            {mesProjets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titre} — BRL {p.brl_actuel}{p.statut === 'DIPLOME' ? ' ✓ Diplômé' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : offres.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
            <BadgeDollarSign className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-[13px] text-zinc-500">Aucune offre disponible pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offres.map((offre) => (
            <FinancementCard
              key={offre.id}
              offre={offre}
              onPostuler={projetActifId ? () => setOffreSelectionnee(offre) : undefined}
            />
          ))}
        </div>
      )}

      {offreSelectionnee && projetActifId && (
        <PostulerModal
          offre={offreSelectionnee}
          projetId={projetActifId}
          onClose={() => setOffreSelectionnee(null)}
        />
      )}
    </div>
  )
}
