import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMesOffres } from '@/hooks/useInvestisseur'
import { useMesCandidatures } from '@/hooks/useFinancements'
import {authStore} from '@/stores/authStore'
import { StatutOffre, StatutCandidature, TypeFinancement } from '@matura/shared'
import { Loader2, Plus, ChevronRight, Layers, ArrowRight, BarChart3, Clock, Factory, Folder, BadgeDollarSign } from 'lucide-react'
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
              className="w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 group"
            >
              <div>
                {/* Header: Icon + Title + Statut */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 shrink-0 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-700 transition-colors">
                    <BadgeDollarSign className="w-4.5 h-4.5" strokeWidth={1.25} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-[15px] text-zinc-900 group-hover:text-green-700 transition-colors truncate">
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
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 font-bold uppercase tracking-[0.12em] shrink-0">
                      {TYPE_LABELS[offre.typeFinancement as TypeFinancement] ?? offre.typeFinancement}
                    </span>
                  </div>
                </div>

                {/* Content block: description and meta, indented */}
                <div className="pl-12 space-y-3">
                  <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2 text-thin">
                    {offre.description || "Aucune description fournie pour cette offre."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-[11px] text-zinc-400 font-medium pt-1">
                    <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5 text-zinc-300" /> BRL ≥ {offre.stadeCible}</span>
                    {offre.dateCloture && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-300" /> Clôture {formatDate(offre.dateCloture)}</span>}
                    {offre.secteurs && offre.secteurs.length > 0 && <span className="flex items-center gap-1.5"><Factory className="w-3.5 h-3.5 text-zinc-300" /> {offre.secteurs.slice(0, 2).join(', ')}</span>}
                  </div>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-1">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0',
                    offre._count.candidatures > 0
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500',
                  )}>
                    <span className="text-[12px] font-bold">
                      {offre._count.candidatures}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-450">
                      candidature{offre._count.candidatures !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {offre._count.candidatures > 0 && (
                    <span className="text-[11px] font-semibold text-green-600 group-hover:underline transition-colors pl-1">
                      Voir les candidatures
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-zinc-350 group-hover:text-green-600 transition-colors" strokeWidth={1.25} />
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
