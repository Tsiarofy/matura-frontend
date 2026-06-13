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
}

export function StatCard({ label, value, delta, icon: Icon, className }: StatCardProps) {
  let accentColor = 'text-[#19B45B] bg-[#EFFBF3] border-[#CFEEDA]'
  if (label.toLowerCase().includes('projet')) accentColor = 'text-[#6F74F7] bg-[#EEF0FF] border-[#DCE0FF]'
  if (label.toLowerCase().includes('attente')) accentColor = 'text-[#D99816] bg-[#FFF8E8] border-[#F8E6B9]'
  if (label.toLowerCase().includes('accept')) accentColor = 'text-[#19B45B] bg-[#EFFBF3] border-[#CFEEDA]'

  return (
    <Card
      className={cn(
        'rounded-[22px] border border-[var(--color-border)] bg-white p-4 transition-all duration-300 group shadow-sm hover:bg-[var(--color-surface-soft)]/45',
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
                  ? 'bg-[#EFFBF3] text-[#157347] border-[#CFEEDA]' 
                  : 'bg-[#FFF1F4] text-[#BE3456] border-[#FFD9E1]'
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
