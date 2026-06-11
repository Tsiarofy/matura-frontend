import { Link } from '@tanstack/react-router'
import { useProjetsSuivis, type ProjetSuivi } from '@/hooks/useAccompagnement'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { STADE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Loader2, FolderOpen, ChevronRight, Clock, AlertCircle } from 'lucide-react'

// ─── CARTE PROJET SUIVI ───────────────────────────────────────────────────────

function CarteProjetSuivi({ projet }: { projet: ProjetSuivi }) {
  const stade = projet.stade_actif
  const label = stade ? STADE_LABELS[stade.numero] : null
  const needsEval = stade?.en_attente_evaluation

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="panel-flat p-5 flex items-start gap-4 group hover:border-zinc-300 hover:shadow-sm transition-all duration-200 block"
    >
      {/* Avatar initiales */}
      <div className="w-10 h-10 rounded-[13px] bg-[var(--color-surface-soft)] border border-[var(--color-border)] flex items-center justify-center shrink-0 text-[13px] font-bold text-[var(--color-text-muted)] group-hover:bg-[var(--color-success-bg)] group-hover:border-[var(--color-success-border)] group-hover:text-[var(--color-success-text)] transition-colors">
        {projet.titre.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-success-text)] transition-colors">
            {projet.titre}
          </p>
          {projet.brl_actuel !== undefined && (
            <BRLBadge brl={projet.brl_actuel} />
          )}
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {projet.proprietaire.prenom} {projet.proprietaire.nom} · {projet.region}
        </p>

        {stade && (
          <div className={cn(
            'inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border',
            needsEval
              ? 'bg-[var(--color-tsisy-amber-bg)] text-[#a16207] border-[#FDE68A]'
              : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border)]',
          )}>
            {needsEval
              ? <AlertCircle className="w-3 h-3" />
              : <Clock className="w-3 h-3" />
            }
            Stade {stade.numero} — {label}
            {needsEval && ' · À évaluer'}
          </div>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-[var(--color-text-disabled)] group-hover:text-[var(--color-success)] shrink-0 mt-1 transition-colors" />
    </Link>
  )
}

// ─── PAGE PROJETS SUIVIS ──────────────────────────────────────────────────────

export default function ProjetsSuivisPage() {
  const { data: projetsSuivis, isLoading: loadingProjets } = useProjetsSuivis()
  const projets = projetsSuivis ?? []
  const projetsAvecEval = projets.filter((p) => p.stade_actif?.en_attente_evaluation)

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      {/* En-tête */}
      <div>
        <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
          Projets suivis
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
          Suivez et évaluez l'avancement des projets que vous accompagnez.
        </p>
      </div>

      <div className="space-y-3">
        {loadingProjets ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-success)]" />
            <p className="text-[12px] text-[var(--color-text-muted)]">Chargement…</p>
          </div>
        ) : projets.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
              <FolderOpen className="w-6 h-6 text-[var(--color-text-muted)]" />
            </div>
            <div className="space-y-1">
              <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                Aucun projet suivi
              </p>
              <p className="text-[12px] text-[var(--color-text-muted)] max-w-xs leading-relaxed">
                Acceptez une demande d'accompagnement pour commencer.
              </p>
            </div>
          </div>
        ) : (
          <>
            {projetsAvecEval.length > 0 && (
              <div className="flex items-center gap-3 rounded-[18px] border border-[#FDE68A] bg-[var(--color-tsisy-amber-bg)] px-4 py-3.5">
                <AlertCircle className="w-4 h-4 text-[var(--color-tsisy-amber)] shrink-0" />
                <p className="text-[12px] font-semibold text-[#a16207]">
                  {projetsAvecEval.length} stade{projetsAvecEval.length > 1 ? 's' : ''} en attente d'évaluation.
                </p>
              </div>
            )}
            <div className="space-y-2.5">
              {projets.map((p) => <CarteProjetSuivi key={p.id} projet={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
