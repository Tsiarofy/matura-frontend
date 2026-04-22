import { Badge } from '@/components/ui/badge'
import {type StatutStade } from '@matura/shared'
import { cn } from '@/lib/utils'

interface StatutBadgeProps {
  statut: StatutStade
  className?: string
}

const STATUT_CONFIG: Record<StatutStade, { label: string; classes: string; dotColor: string }> = {
  VALIDE: {
    label: 'Validé',
    classes: 'bg-green-50 text-green-700 border-green-200',
    dotColor: 'bg-green-600',
  },
  BROUILLON: {
    label: 'Brouillon',
    classes: 'bg-blue-50 text-blue-800 border-blue-100',
    dotColor: 'bg-blue-600',
  },
  SOUMIS: {
    label: 'Soumis',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-400',
  },
  EN_REVISION: {
    label: 'En révision',
    classes: 'bg-red-50 text-red-800 border-red-100',
    dotColor: 'bg-red-600',
  },
  VERROUILLE: {
    label: 'Verrouillé',
    classes: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    dotColor: 'bg-zinc-400',
  },
  DEBLOQUE: {
    label: 'Débloqué',
    classes: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    dotColor: 'bg-zinc-500',
  },
}

export function StatutBadge({ statut, className }: StatutBadgeProps) {
  const config = STATUT_CONFIG[statut] || STATUT_CONFIG.BROUILLON

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 rounded-full',
        'text-[11px] font-medium border',
        config.classes,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </Badge>
  )
}
