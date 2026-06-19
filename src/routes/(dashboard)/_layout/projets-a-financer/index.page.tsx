import { Link } from '@tanstack/react-router'
import { useProjetsInvestisseurs } from '@/hooks/useInvestisseur'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { Loader2, ChevronRight, Search } from 'lucide-react'
import { cn, formatDecimal } from '@/lib/utils'

export default function ProjetsAFinancerPage() {
  const { data, isLoading } = useProjetsInvestisseurs()
  const projets = data?.projets ?? []

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
          Projets à financer
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
          Projets ayant validé au moins 6 stades avec un score ≥ 65.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#6f74f7]" />
          <p className="text-[12px] text-[var(--color-text-muted)]">Chargement des projets…</p>
        </div>
      ) : projets.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            <Search className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <div className="space-y-1">
            <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
              Aucun projet éligible
            </p>
            <p className="text-[12px] text-[var(--color-text-muted)] max-w-sm">
              Les projets ayant validé au moins 6 stades et obtenu un score ≥ 65 apparaissent ici.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {projets.map((p) => {
            const scoreColor = p.score_global && p.score_global >= 80
              ? 'bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success-text)]'
              : 'bg-[var(--color-tsisy-amber-bg)] border-[#FDE68A] text-[#a16207]'

            return (
              <Link
                key={p.id}
                to="/projets-a-financer/$projetId"
                params={{ projetId: p.id }}
                className="w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 group block"
              >
                {/* Score bubble */}
                <div className={cn(
                  'w-14 h-14 rounded-[16px] flex flex-col items-center justify-center shrink-0 border',
                  scoreColor,
                )}>
                  <p className="text-[18px] font-bold leading-none">
                    {p.score_global ? formatDecimal(p.score_global) : '—'}
                  </p>
                  <p className="text-[9px] font-semibold mt-0.5 opacity-70 uppercase tracking-wider">score</p>
                </div>

                 {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">
                      {p.titre}
                    </p>
                    <BRLBadge brl={p.brl_actuel} />
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {p.domaine} · {p.region}
                    {p.mentor && ` · ${p.mentor.prenom} ${p.mentor.nom}`}
                  </p>

                  {/* Score breakdown mini bars */}
                  {p.score_global && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <ScoreMiniBar label="Innovation" value={p.score_global * 0.9} />
                      <ScoreMiniBar label="Marché" value={p.score_global * 1.05} />
                      <ScoreMiniBar label="Finance" value={p.score_global * 0.85} />
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-[var(--color-text-disabled)] shrink-0 transition-colors" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ScoreMiniBar({ label, value }: { label: string; value: number }) {
  const capped = Math.min(Math.max(value, 0), 100)
  const color = capped >= 70 ? 'bg-[var(--color-success)]' : capped >= 50 ? 'bg-[var(--color-tsisy-amber)]' : 'bg-zinc-300'
  return (
    <div className="flex items-center gap-1.5 min-w-[80px]">
      <span className="text-[9px] text-[var(--color-text-disabled)] shrink-0 w-[52px]">{label}</span>
      <div className="flex-1 h-1 bg-[var(--color-surface-soft)] rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${capped}%` }} />
      </div>
      <span className="text-[9px] text-[var(--color-text-muted)] font-semibold">{formatDecimal(capped)}</span>
    </div>
  )
}
