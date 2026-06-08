import { Link } from '@tanstack/react-router'
import { useProjetsSuivis, type ProjetSuivi } from '@/hooks/useAccompagnement'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { STADE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Loader2, FolderOpen, ChevronRight, Clock, AlertCircle, Briefcase } from 'lucide-react'

// ─── CARTE PROJET SUIVI ───────────────────────────────────────────────────────

function CarteProjetSuivi({ projet }: { projet: ProjetSuivi }) {
  const stade = projet.stade_actif
  const label = stade ? STADE_LABELS[stade.numero] : null

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-green-200 transition-colors block"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
          <Briefcase className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-medium text-zinc-800 truncate">
              {projet.titre}
            </p>
            {projet.brl_actuel !== undefined && (
              <BRLBadge brl={projet.brl_actuel} />
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {projet.proprietaire.prenom} {projet.proprietaire.nom} · {projet.region}
          </p>

          {stade && (
            <div className={cn(
              'inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-[11px]',
              stade.en_attente_evaluation
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-zinc-50 text-zinc-600',
            )}>
              {stade.en_attente_evaluation
                ? <AlertCircle className="w-3 h-3" />
                : <Clock className="w-3 h-3" />
              }
              Stade {stade.numero} — {label}
              {stade.en_attente_evaluation && ' · À évaluer'}
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0 mt-1" />
      </div>
    </Link>
  )
}

// ─── PAGE PROJETS SUIVIS ──────────────────────────────────────────────────────

export default function ProjetsSuivisPage() {
  const { data: projetsSuivis, isLoading: loadingProjets } = useProjetsSuivis()
  const projets = projetsSuivis ?? []
  const projetsAvecEval = projets.filter((p) => p.stade_actif?.en_attente_evaluation)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* En-tête */}
      <div>
        <h1 className="text-[20px] text-zinc-900">Projets suivis</h1>
        <p className="text-[12px] text-zinc-500 mt-1">
          Suivez et évaluez l'avancement des projets que vous accompagnez.
        </p>
      </div>

      <div className="space-y-3">
        {loadingProjets ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          </div>
        ) : projets.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-[13px] text-zinc-500">
              Vous ne suivez aucun projet pour l'instant.
            </p>
            <p className="text-[11px] text-zinc-400 text-center max-w-xs">
              Acceptez une demande d'accompagnement pour commencer.
            </p>
          </div>
        ) : (
          <>
            {projetsAvecEval.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-[12px] text-amber-700">
                  {projetsAvecEval.length} stade{projetsAvecEval.length > 1 ? 's' : ''} en attente d'évaluation.
                </p>
              </div>
            )}
            <div className="space-y-2">
              {projets.map((p) => <CarteProjetSuivi key={p.id} projet={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
