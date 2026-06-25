import { Link } from '@tanstack/react-router'
import { useProjetsSuivis, type ProjetSuivi } from '@/hooks/useAccompagnement'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { STADE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Loader2, FolderOpen, Clock, AlertCircle } from 'lucide-react'



function CarteProjetSuivi({ projet }: { projet: ProjetSuivi }) {
  const stade = projet.stade_actif
  const label = stade ? STADE_LABELS[stade.numero] : null
  const needsEval = stade?.en_attente_evaluation

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-zinc-200 hover:shadow-none block"
    >
      <div>
        {/* Header: Avatar + Title + Badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[12px] bg-[#eafdf3] border border-[#c5f3d8] flex items-center justify-center shrink-0 text-[12px] font-bold text-[#257a4e]">
            {projet.titre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-[15px] font-semibold text-zinc-900 truncate">
              {projet.titre}
            </h3>
          </div>
          {projet.brl_actuel !== undefined && (
            <BRLBadge brl={projet.brl_actuel} />
          )}
        </div>

        {/* Content block: owner, region, stade details indented */}
        <div className="pl-12 space-y-2.5">
          <p className="text-[11.5px] text-zinc-550 font-semibold leading-none">
            {projet.proprietaire.prenom} {projet.proprietaire.nom} · <span className="text-zinc-400 font-medium">{projet.region}</span>
          </p>

          {stade && (
            <div className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.10em] border',
              needsEval
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-[#eafdf3] text-[#257a4e] border border-[#c5f3d8]',
            )}>
              {needsEval
                ? <AlertCircle className="w-3 h-3" />
                : <Clock className="w-3 h-3 text-[#257a4e]" />
              }
              Stade {stade.numero} — {label}
              {needsEval && ' · À évaluer'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}



export default function ProjetsSuivisPage() {
  const { data: projetsSuivis, isLoading: loadingProjets } = useProjetsSuivis()
  const projets = projetsSuivis ?? []
  const projetsAvecEval = projets.filter((p) => p.stade_actif?.en_attente_evaluation)

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
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
