import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useCandidaturesOffre, useChangerStatutCandidature } from '@/hooks/useInvestisseur'
import { useFinancementDetail } from '@/hooks/useFinancements'
import { ProjetCandidatCard } from '@/components/financement/ProjetCandidatCard'
import { StatutCandidature } from '@matura/shared'
import { type CandidatureAvecProjet } from '@/hooks/useInvestisseur'
import { Loader2, ArrowLeft } from 'lucide-react'

const STATUTS_FILTRE: { value: StatutCandidature | 'TOUS'; label: string }[] = [
  { value: 'TOUS',                          label: 'Tous' },
  { value: StatutCandidature.EN_ATTENTE,    label: 'En attente' },
  { value: StatutCandidature.EN_REVUE,      label: 'En revue' },
  { value: StatutCandidature.ACCEPTEE,      label: 'Acceptées' },
  { value: StatutCandidature.REJETEE,       label: 'Rejetées' },
]

export default function CandidaturesOffrePage() {
  const { offreId } = useParams({ from: '/(dashboard)/_layout/mes-financements/$offreId/candidatures' })
  const navigate = useNavigate()
  const [filtreStatut, setFiltreStatut] = useState<StatutCandidature | 'TOUS'>('TOUS')
  const [detailOuvert, setDetailOuvert] = useState<string | null>(null)

  const { data: offre }                                = useFinancementDetail(offreId)
  const { data: candidatures, isLoading, isError }     = useCandidaturesOffre(offreId)
  const changerStatut                                  = useChangerStatutCandidature()

  const candidaturesFiltrees = (candidatures ?? []).filter(
    (c) => filtreStatut === 'TOUS' || c.statut === filtreStatut,
  )

  const handleChangerStatut = (c: CandidatureAvecProjet, statut: StatutCandidature) => {
    changerStatut.mutate({ candidatureId: c.id, statut, offreId })
  }

  // Stats rapides
  const stats = candidatures
    ? {
        enAttente: candidatures.filter((c) => c.statut === StatutCandidature.EN_ATTENTE).length,
        enRevue:   candidatures.filter((c) => c.statut === StatutCandidature.EN_REVUE).length,
        acceptees: candidatures.filter((c) => c.statut === StatutCandidature.ACCEPTEE).length,
      }
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Navigation */}
      <button
        onClick={() => navigate({ to: '/mes-financements' })}
        className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour à mes financements
      </button>

      {/* En-tête */}
      <div className="space-y-1">
        <h1 className="text-[20px] text-zinc-900">Projets candidats</h1>
        {offre && (
          <p className="text-[12px] text-zinc-500">
            Offre :{' '}
            <span className="text-zinc-700">{offre.titre}</span>
            {offre.stadeCible && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded">
                BRL ≥ {offre.stadeCible}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Stats rapides */}
      {stats && (stats.enAttente > 0 || stats.enRevue > 0 || stats.acceptees > 0) && (
        <div className="flex gap-3">
          {stats.enAttente > 0 && (
            <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <span className="text-[16px] font-medium text-yellow-700">{stats.enAttente}</span>
              <span className="text-[10px] text-yellow-600">En attente</span>
            </div>
          )}
          {stats.enRevue > 0 && (
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <span className="text-[16px] font-medium text-blue-700">{stats.enRevue}</span>
              <span className="text-[10px] text-blue-600">En revue</span>
            </div>
          )}
          {stats.acceptees > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="text-[16px] font-medium text-green-700">{stats.acceptees}</span>
              <span className="text-[10px] text-green-600">Acceptées</span>
            </div>
          )}
        </div>
      )}

      {/* Filtres par statut */}
      {candidatures && candidatures.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {STATUTS_FILTRE.map(({ value, label }) => {
            const count = value === 'TOUS'
              ? candidatures.length
              : candidatures.filter((c) => c.statut === value).length
            if (value !== 'TOUS' && count === 0) return null
            return (
              <button
                key={value}
                onClick={() => setFiltreStatut(value)}
                className={[
                  'flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border transition-colors',
                  filtreStatut === value
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300',
                ].join(' ')}
              >
                {label}
                <span className={[
                  'text-[10px] px-1 py-0.5 rounded',
                  filtreStatut === value ? 'bg-white/20' : 'bg-zinc-100',
                ].join(' ')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Contenu */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-[12px] text-zinc-500">⚠️ Impossible de charger les candidatures.</p>
        </div>
      ) : !candidatures || candidatures.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-2 text-center">
          <p className="text-[13px] text-zinc-500">Aucune candidature reçue</p>
          <p className="text-[11px] text-zinc-400">
            Personne n'a encore postulé à cette offre.
          </p>
        </div>
      ) : candidaturesFiltrees.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2 text-center">
          <p className="text-[12px] text-zinc-500">Aucune candidature avec ce statut.</p>
          <button
            onClick={() => setFiltreStatut('TOUS')}
            className="text-[12px] text-green-600 hover:text-green-700"
          >
            Voir toutes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {candidaturesFiltrees.map((candidature) => (
            <ProjetCandidatCard
              key={candidature.id}
              candidature={candidature}
              detailOuvert={detailOuvert === candidature.id}
              onToggleDetail={() =>
                setDetailOuvert((prev) =>
                  prev === candidature.id ? null : candidature.id,
                )
              }
              onChangerStatut={(statut) => handleChangerStatut(candidature, statut)}
              isUpdating={changerStatut.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
