import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  delta?: {
    value: number
    label: string
    isPositive?: boolean
  }
  icon?: LucideIcon
  className?: string
  slot?: 1 | 2 | 3 | 4
}

export function StatCard({ label, value, delta, icon: Icon, className, slot }: StatCardProps) {
  let accentColor = 'text-[var(--color-kpi-green-icon)] bg-[var(--color-kpi-green-icon-bg)] border-[var(--color-tsisy-green-border)]'
  let cardBg = 'bg-[#ffffff] border-[#eeeeea]'

  const actualSlot = slot ?? ((): 1 | 2 | 3 | 4 => {
    const cleanLabel = label.toLowerCase()
    if (cleanLabel.includes('candidature') || cleanLabel.includes('évaluation') || cleanLabel.includes('evaluation')) return 2
    if (cleanLabel.includes('taux') || cleanLabel.includes('demande')) return 3
    if (cleanLabel.includes('attente') || cleanLabel.includes('financ')) return 4
    return 1
  })()

  if (actualSlot === 2) {
    accentColor = 'text-[var(--color-kpi-teal-icon)] bg-[var(--color-kpi-teal-icon-bg)] border-[var(--color-tsisy-teal-border)]'
  } else if (actualSlot === 3) {
    accentColor = 'text-[var(--color-kpi-green-icon)] bg-[var(--color-kpi-green-icon-bg)] border-[var(--color-tsisy-green-border)]'
  } else if (actualSlot === 4) {
    accentColor = 'text-[var(--color-kpi-amber-icon)] bg-[var(--color-kpi-amber-icon-bg)] border-[var(--color-tsisy-amber-border)]'
  }

  return (
    <Card
      className={cn(
        'rounded-[22px] border p-4 transition-all duration-300 group shadow-none',
        cardBg,
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{label}</p>
          {Icon && (
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border transition-colors", accentColor)}>
              <Icon size={18} strokeWidth={1.25} />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </h3>
          
          {delta && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className={cn(
                'flex items-center gap-0.5 rounded-full border px-2 py-1 text-[10px] font-semibold',
                delta.isPositive 
                  ? 'bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]' 
                  : 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]'
              )}>
                {delta.isPositive ? <ArrowUpRight size={10} strokeWidth={1.25} /> : <ArrowDownRight size={10} strokeWidth={1.25} />}
                {delta.value}%
              </div>
              <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                {delta.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
