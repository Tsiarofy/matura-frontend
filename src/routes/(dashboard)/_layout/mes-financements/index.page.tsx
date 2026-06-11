import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMesOffres } from '@/hooks/useInvestisseur'
import { useMesCandidatures } from '@/hooks/useFinancements'
import {authStore} from '@/stores/authStore'
import { StatutOffre, StatutCandidature, TypeFinancement } from '@matura/shared'
import { Loader2, Plus, ChevronRight, Layers, ArrowRight, BarChart3, Clock, Factory, Folder } from 'lucide-react'
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
  [StatutOffre.OUVERTE]:  'bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]',
  [StatutOffre.EN_COURS]: 'bg-green-50 text-green-700 border-green-200',
  [StatutOffre.FERMEE]:   'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  [StatutOffre.CLOTUREE]: 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border)]',
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
  [StatutCandidature.EN_ATTENTE]: 'bg-[var(--color-tsisy-amber-bg)] text-[#a16207] border-[#FDE68A]',
  [StatutCandidature.EN_REVUE]:   'bg-green-50 text-green-700 border-green-200',
  [StatutCandidature.ACCEPTEE]:   'bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]',
  [StatutCandidature.REJETEE]:    'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]',
  [StatutCandidature.RETIREE]:    'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border)]',
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
    <div className="page-shell max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
            Mes financements
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
            Cliquez sur une offre pour voir les projets candidats
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-[14px] text-[12px] font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nouvelle offre
        </button>
      </div>

      {showForm && (
        <OffreFinancementForm onClose={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-[12px] text-[var(--color-text-muted)]">Erreur : Impossible de charger vos offres.</p>
        </div>
      ) : !offres || offres.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            <Layers className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <div className="space-y-1">
            <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Aucune offre créée</p>
            <p className="text-[12px] text-[var(--color-text-muted)] max-w-sm">
              Publiez votre première offre de financement pour attirer des candidats.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-[12.5px] px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-[14px] transition-colors font-semibold"
          >
            Créer une offre de financement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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
              className="panel-flat p-6 space-y-4 cursor-pointer hover:border-zinc-300 hover:shadow-sm transition-all duration-200 group"
            >
              {/* Top row: badges + candidature counter */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  <span className={cn(
                    'text-[10px] px-2.5 py-0.5 rounded-full border font-semibold shrink-0',
                    STATUT_OFFRE_COLORS[offre.statut as StatutOffre],
                  )}>
                    {STATUT_OFFRE_LABELS[offre.statut as StatutOffre]}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] font-semibold shrink-0">
                    {TYPE_LABELS[offre.typeFinancement as TypeFinancement] ?? offre.typeFinancement}
                  </span>
                </div>

                {/* Candidature count badge */}
                <div className={cn(
                  'flex flex-col items-center px-3 py-1.5 rounded-[12px] border shrink-0',
                  offre._count.candidatures > 0
                    ? 'bg-[var(--color-success-bg)] border-[var(--color-success-border)]'
                    : 'bg-[var(--color-surface-soft)] border-[var(--color-border)]',
                )}>
                  <span className={cn(
                    'text-[16px] font-semibold leading-none',
                    offre._count.candidatures > 0 ? 'text-[var(--color-success-text)]' : 'text-[var(--color-text-muted)]',
                  )}>
                    {offre._count.candidatures}
                  </span>
                  <span className="text-[9px] text-[var(--color-text-disabled)] mt-0.5 font-medium">
                    candidature{offre._count.candidatures !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Title & description */}
              <div>
                <p className="text-[14px] font-semibold text-[var(--color-text-primary)] group-hover:text-green-600 transition-colors">
                  {offre.titre}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-2">{offre.description}</p>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-[11px] text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> BRL ≥ {offre.stadeCible}</span>
                {offre.dateCloture && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Clôture {formatDate(offre.dateCloture)}</span>}
                {offre.secteurs?.length > 0 && <span className="flex items-center gap-1.5"><Factory className="w-3.5 h-3.5" /> {offre.secteurs.slice(0, 2).join(', ')}</span>}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <p className="text-[11px] font-semibold text-green-600 group-hover:text-green-700 transition-colors">
                  {offre._count.candidatures > 0
                    ? `Voir les ${offre._count.candidatures} candidat${offre._count.candidatures > 1 ? 's' : ''}`
                    : 'Voir les candidatures'}
                </p>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-disabled)] group-hover:text-green-600 transition-colors" />
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
            <div key={c.id} className="panel-flat p-6 space-y-3 group hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <button
                    className="text-[14px] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-success-text)] transition-colors text-left"
                    onClick={() => navigate({
                      to: '/financements/$financementId',
                      params: { financementId: c.offreId },
                    })}
                  >
                    {c.offre?.titre}
                  </button>
                  {c.offre?.investisseur && (
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                      {c.offre.investisseur.prenom} {c.offre.investisseur.nom}
                    </p>
                  )}
                </div>
                <span className={cn(
                  'text-[10px] px-2.5 py-0.5 rounded-full border shrink-0 font-semibold',
                  STATUT_CAND_COLORS[c.statut as StatutCandidature],
                )}>
                  {STATUT_CAND_LABELS[c.statut as StatutCandidature]}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                <Folder className="w-3.5 h-3.5" />
                <span>{c.projet?.titre}</span>
                {c.projet?.brl_actuel !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success-border)] rounded-full font-semibold">
                    BRL {c.projet.brl_actuel}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <p className="text-[10px] text-[var(--color-text-disabled)]">
                  Postulé le{' '}
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '–'}
                </p>
                <button
                  onClick={() => navigate({
                    to: '/financements/$financementId',
                    params: { financementId: c.offreId },
                  })}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Voir l'offre <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
