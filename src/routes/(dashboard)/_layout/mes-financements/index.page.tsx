import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMesOffres } from '@/hooks/useInvestisseur'
import { useMesCandidatures } from '@/hooks/useFinancements'
import {authStore} from '@/stores/authStore'
import { StatutOffre, StatutCandidature, TypeFinancement } from '@matura/shared'
import { Loader2, Plus, ChevronRight, Layers, ArrowRight, BarChart3, Clock, Folder, BadgeDollarSign } from 'lucide-react'
import { OffreFinancementForm } from '@/components/financement/OffreFinancementForm'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]:  'Subvention',
  [TypeFinancement.PRET]:        'Prêt',
  [TypeFinancement.EQUITY]:      'Equity',
  [TypeFinancement.OBLIGATION]:  'Obligation',
  [TypeFinancement.DON]:         'Don',
}

const STATUT_OFFRE_COLORS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]:  'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  [StatutOffre.EN_COURS]: 'bg-amber-50 text-amber-700 border-amber-250/50',
  [StatutOffre.FERMEE]:   'bg-zinc-550/10 text-zinc-500 border-zinc-200/50',
  [StatutOffre.CLOTUREE]: 'bg-zinc-550/10 text-zinc-500 border-zinc-200/50',
}

const STATUT_OFFRE_LABELS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]:  'Ouverte',
  [StatutOffre.EN_COURS]: 'En cours',
  [StatutOffre.FERMEE]:   'Fermée',
  [StatutOffre.CLOTUREE]: 'Clôturée',
}

const STATUT_CAND_LABELS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'En attente',
  [StatutCandidature.EN_REVUE]:   'En revue',
  [StatutCandidature.ACCEPTEE]:   'Acceptée',
  [StatutCandidature.REJETEE]:    'Rejetée',
  [StatutCandidature.RETIREE]:    'Retirée',
}

const STATUT_CAND_COLORS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'bg-amber-50 text-amber-700 border-amber-200',
  [StatutCandidature.EN_REVUE]:   'bg-blue-50 text-blue-700 border-blue-200',
  [StatutCandidature.ACCEPTEE]:   'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  [StatutCandidature.REJETEE]:    'bg-rose-50 text-rose-700 border-rose-200/50',
  [StatutCandidature.RETIREE]:    'bg-zinc-550/10 text-zinc-500 border-zinc-200/50',
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function MesFinancementsPage() {
  const utilisateur = authStore((s) => s.utilisateur)
  const isInvestisseur = utilisateur?.role === 'INVESTISSEUR'
  return isInvestisseur ? <VueInvestisseur /> : <VueEntrepreneur />
}

// ─── VUE INVESTISSEUR ─────────────────────────────────────────────────────────

function VueInvestisseur() {
  const navigate = useNavigate()
  const { data: offres, isLoading, isError } = useMesOffres()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="page-shell max-w-3xl mx-auto w-full space-y-6">
      {/* En-tête macOS-like */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-zinc-200/40">
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold tracking-tight text-zinc-900 font-heading">
            Mes financements
          </h1>
          <p className="text-[13px] text-zinc-400 font-medium">
            Gérez vos offres de financement et suivez les projets postulants.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[12.5px] font-semibold shadow-sm transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Nouvelle offre
        </button>
      </div>

      {showForm && (
        <OffreFinancementForm onClose={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-550" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 border border-rose-100 bg-rose-50/20 rounded-[24px] p-6">
          <p className="text-[13px] text-rose-700 font-medium">Erreur : Impossible de charger vos offres de financement.</p>
        </div>
      ) : !offres || offres.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4 text-center border border-zinc-200/50 bg-white/70 backdrop-blur-sm rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-zinc-200 bg-zinc-50 text-zinc-400">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <p className="text-[14.5px] font-semibold text-zinc-800">Aucune offre créée</p>
            <p className="text-[12.5px] text-zinc-400 max-w-sm leading-relaxed">
              Publiez votre première offre de financement pour attirer et évaluer des projets candidats.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-[12.5px] px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all duration-200 font-semibold cursor-pointer shadow-sm"
          >
            Créer une offre de financement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {offres.map((offre) => (
            <article
              key={offre.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate({
                to: '/mes-financements/$offreId/candidatures',
                params: { offreId: offre.id },
              })}
              onKeyDown={(e) => e.key === 'Enter' && navigate({
                to: '/mes-financements/$offreId/candidatures',
                params: { offreId: offre.id },
              })}
              className="w-full relative cursor-pointer rounded-[24px] border border-zinc-200/50 bg-white/70 backdrop-blur-sm p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:border-zinc-350 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02)] hover:bg-white group"
            >
              <div>
                {/* Header: Title + Statuts */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-semibold text-[15.5px] text-zinc-850 group-hover:text-zinc-900 transition-colors truncate">
                      {offre.titre}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn(
                      'text-[9px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-[0.12em] shrink-0',
                      STATUT_OFFRE_COLORS[offre.statut as StatutOffre],
                    )}>
                      {STATUT_OFFRE_LABELS[offre.statut as StatutOffre]}
                    </span>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full border border-zinc-200/60 bg-zinc-50/50 text-zinc-500 font-bold uppercase tracking-[0.12em] shrink-0">
                      {TYPE_LABELS[offre.typeFinancement as TypeFinancement] ?? offre.typeFinancement}
                    </span>
                  </div>
                </div>

                {/* Content description and target BRL */}
                <div className="space-y-4">
                  <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2 font-normal">
                    {offre.description || "Aucune description fournie pour cette offre."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-[11px] text-zinc-400 font-medium">
                    <span className="flex items-center gap-1.5 text-zinc-500"><BarChart3 className="w-3.5 h-3.5 text-zinc-300" /> BRL ciblé : <strong className="text-zinc-650">≥ {offre.stadeCible}</strong></span>
                    {offre.dateCloture && <span className="flex items-center gap-1.5 text-zinc-500"><Clock className="w-3.5 h-3.5 text-zinc-300" /> Clôture le {formatDate(offre.dateCloture)}</span>}
                  </div>

                  {offre.secteurs && offre.secteurs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {offre.secteurs.slice(0, 3).map((secteur) => (
                        <span key={secteur} className="text-[9.5px] px-2.5 py-0.5 bg-zinc-50 border border-zinc-200/50 text-zinc-500 rounded-full font-semibold">
                          {secteur}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between border-t border-zinc-100/70 pt-3.5 mt-1">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-200',
                    offre._count.candidatures > 0
                      ? 'bg-emerald-50/50 border-emerald-200/60 text-emerald-700'
                      : 'bg-zinc-50 border-zinc-200/50 text-zinc-400',
                  )}>
                    <span className="text-[12px] font-bold">
                      {offre._count.candidatures}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500">
                      candidature{offre._count.candidatures !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {offre._count.candidatures > 0 && (
                    <span className="text-[11.5px] font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors pl-1">
                      Gérer les candidatures
                    </span>
                  )}
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-50 border border-zinc-100/60 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-200 shrink-0">
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── VUE ENTREPRENEUR ─────────────────────────────────────────────────────────

function VueEntrepreneur() {
  const navigate = useNavigate()
  const { data: candidatures, isLoading, isError } = useMesCandidatures()

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
            Mes candidatures
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
            Suivez l'état de vos postulations
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/financements' })}
          className="text-[12px] px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-[14px] transition-colors font-semibold"
        >
          Parcourir les offres
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-[12px] text-[var(--color-text-muted)]">Erreur : Impossible de charger vos candidatures.</p>
        </div>
      ) : !candidatures || candidatures.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Aucune candidature soumise</p>
          <button
            onClick={() => navigate({ to: '/financements' })}
            className="text-[12px] text-[var(--color-success-text)] hover:text-[var(--color-success)] font-semibold transition-colors"
          >
            Découvrir les offres disponibles →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => (
            <div
              key={c.id}
              className="w-full relative rounded-[22px] border border-zinc-100 bg-white p-6 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 group"
            >
              <div>
                {/* Title row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 shrink-0 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-700 transition-colors">
                    <BadgeDollarSign className="w-4.5 h-4.5" strokeWidth={1.25} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      className="text-[15px] font-semibold text-zinc-900 group-hover:text-green-700 transition-colors text-left truncate w-full"
                      onClick={() => navigate({
                        to: '/financements/$financementId',
                        params: { financementId: c.offreId },
                      })}
                    >
                      {c.offre?.titre}
                    </button>
                  </div>
                  <span className={cn(
                    'text-[9px] px-2.5 py-0.5 rounded-full border shrink-0 font-bold uppercase tracking-[0.12em]',
                    STATUT_CAND_COLORS[c.statut as StatutCandidature],
                  )}>
                    {STATUT_CAND_LABELS[c.statut as StatutCandidature]}
                  </span>
                </div>

                {/* Content info indented */}
                <div className="pl-12 space-y-3">
                  {c.offre?.investisseur && (
                    <p className="text-[12px] text-zinc-500 font-semibold">
                      Proposé par {c.offre.investisseur.prenom} {c.offre.investisseur.nom}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[11.5px] text-zinc-400 font-medium">
                    <Folder className="w-3.5 h-3.5 text-zinc-300" />
                    <span>{c.projet?.titre}</span>
                    {c.projet?.brl_actuel !== undefined && (
                      <span className="text-[9px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full font-bold uppercase tracking-[0.12em]">
                        BRL {c.projet.brl_actuel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-1">
                <p className="text-[11px] text-zinc-450 font-semibold">
                  Postulé le{' '}
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '–'}
                </p>
                <button
                  onClick={() => navigate({
                    to: '/financements/$financementId',
                    params: { financementId: c.offreId },
                  })}
                  className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-green-700 transition-colors"
                >
                  Voir l'offre <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
