import { Link } from '@tanstack/react-router'
import { useProjetsInvestisseurs } from '@/hooks/useInvestisseur'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { Loader2, TrendingUp, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProjetsAFinancerPage() {
  const { data, isLoading } = useProjetsInvestisseurs()
  const projets = data?.projets ?? []

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-[20px] text-zinc-900">Projets à financer</h1>
        <p className="text-[12px] text-zinc-500 mt-1">Projets ayant validé au moins 6 stades avec un score ≥ 65.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-green-600" /></div>
      ) : projets.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-[13px] text-zinc-500">Aucun projet éligible pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projets.map((p) => (
            <Link
              key={p.id}
              to="/projets-a-financer/$projetId"
              params={{ projetId: p.id }}
              className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-green-200 transition-colors block"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border',
                  p.score_global && p.score_global >= 80 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200',
                )}>
                  <p className={cn('text-[16px] font-medium leading-none',
                    p.score_global && p.score_global >= 80 ? 'text-green-700' : 'text-amber-700',
                  )}>
                    {p.score_global? Math.round(p.score_global) : '—'}
                  </p>
                  <p className="text-[8px] text-zinc-400 mt-0.5">score</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-medium text-zinc-800 truncate">{p.titre}</p>
                    <BRLBadge brl={p.brl_actuel} />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {p.domaine} · {p.region}{p.mentor && ` · ${p.mentor.prenom}  ${p.mentor.nom}`}
                  </p>
                  {p.score_global && (
                    <div className="mt-3 space-y-1">
                      {/* <BarreScore label="Innovation" valeur={Math.round(p)} />
                      <BarreScore label="Marché"     valeur={Math.round(p.score.score_marche)} />
                      <BarreScore label="Équipe"     valeur={Math.round(p.score.score_equipe)} />
                      <BarreScore label="Finance"    valeur={Math.round(p.score.score_finance)} />
                      <BarreScore label="Exécution"  valeur={Math.round(p.score.score_execution)} /> */}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
