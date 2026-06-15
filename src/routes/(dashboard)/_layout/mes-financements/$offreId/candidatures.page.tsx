import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useCandidaturesOffre, useChangerStatutCandidature } from '@/hooks/useInvestisseur'
import { useFinancementDetail } from '@/hooks/useFinancements'
import { ProjetCandidatCard } from '@/components/financement/ProjetCandidatCard'
import { StatutCandidature } from '@matura/shared'
import { type CandidatureAvecProjet } from '@/hooks/useInvestisseur'
import { Loader2, ArrowLeft, Clock, Search, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* En-tête macOS-like */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-zinc-200/40">
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold tracking-tight text-zinc-900 font-heading">
            Projets candidats
          </h1>
          {offre && (
            <p className="text-[13px] text-zinc-450 font-medium truncate max-w-[280px] sm:max-w-md">
              Offre : <span className="font-semibold text-zinc-800">{offre.titre}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => navigate({ to: '/mes-financements' })}
          className="inline-flex items-center gap-1.5 px-3.5 h-10 border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50 rounded-xl text-[12px] font-semibold transition-all cursor-pointer group shrink-0 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Retour
        </button>
      </div>

      {/* Stats rapides - Flat widgets */}
      {stats && (stats.enAttente > 0 || stats.enRevue > 0 || stats.acceptees > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.enAttente > 0 && (
            <div className="flex items-center gap-3.5 border border-zinc-200/50 bg-white rounded-[20px] p-4 shadow-sm">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[17px] font-bold text-zinc-850 leading-none">{stats.enAttente}</div>
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">En attente</div>
              </div>
            </div>
          )}
          {stats.enRevue > 0 && (
            <div className="flex items-center gap-3.5 border border-zinc-200/50 bg-white rounded-[20px] p-4 shadow-sm">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
                <Search className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[17px] font-bold text-zinc-850 leading-none">{stats.enRevue}</div>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">En revue</div>
              </div>
            </div>
          )}
          {stats.acceptees > 0 && (
            <div className="flex items-center gap-3.5 border border-zinc-200/50 bg-white rounded-[20px] p-4 shadow-sm">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] bg-emerald-50 border border-emerald-250 text-emerald-700 shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[17px] font-bold text-zinc-850 leading-none">{stats.acceptees}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Acceptées</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtres par statut - macOS Segmented Control */}
      {candidatures && candidatures.length > 0 && (
        <div className="flex p-1 bg-zinc-100/70 backdrop-blur-sm rounded-full border border-zinc-200/40 max-w-max overflow-x-auto hide-scrollbar">
          {STATUTS_FILTRE.map(({ value, label }) => {
            const count = value === 'TOUS'
              ? candidatures.length
              : candidatures.filter((c) => c.statut === value).length
            if (value !== 'TOUS' && count === 0) return null
            const isActive = filtreStatut === value
            return (
              <button
                key={value}
                onClick={() => setFiltreStatut(value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                    : 'text-zinc-500 hover:text-zinc-800 border border-transparent'
                )}
              >
                {label}
                <span className={cn(
                  'text-[9.5px] px-1.5 py-0.5 rounded font-bold transition-colors',
                  isActive ? 'bg-zinc-100 text-zinc-650' : 'bg-zinc-200/55 text-zinc-500',
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Contenu */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-550" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 border border-rose-100 bg-rose-50/20 rounded-[24px] p-6">
          <p className="text-[13px] text-rose-700 font-medium">Erreur : Impossible de charger les candidatures.</p>
        </div>
      ) : !candidatures || candidatures.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-center border border-zinc-200/50 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          <p className="text-[14px] font-semibold text-zinc-800">Aucune candidature reçue</p>
          <p className="text-[12.5px] text-zinc-400 max-w-sm leading-relaxed">
            Personne n'a encore postulé à cette offre de financement.
          </p>
        </div>
      ) : candidaturesFiltrees.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3 text-center border border-zinc-200/50 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          <p className="text-[13px] text-zinc-500">Aucune candidature avec ce statut.</p>
          <button
            onClick={() => setFiltreStatut('TOUS')}
            className="text-[12.5px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Voir toutes les candidatures
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
